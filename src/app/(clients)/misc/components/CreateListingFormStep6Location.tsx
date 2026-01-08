'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui';
import { Card } from '@/components/ui';
import { useBusinessStates } from '@/app/(business)/misc/api/business';
import SelectSingleSimple from '@/components/ui/SelectSingleSimple';
import { CreateListingLocation } from './CreateListingForm';

interface BusinessLocationFormProps {
  setLocation: (location: CreateListingLocation) => void;
  initialLocation?: CreateListingLocation | undefined;
}

const BusinessLocationForm: React.FC<BusinessLocationFormProps> = ({
  setLocation,
  initialLocation,
}) => {
  const { data: statesData, isLoading: statesLoading } = useBusinessStates();
  const states = statesData?.data || [];
  console.log(statesData, 'statesData');

  const googleMapsApiKey = process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'] || '';

  const [location, setLocalLocation] = useState<CreateListingLocation>(
    initialLocation ?? {
      address: '',
      state: '',
      operates_without_location: false,
    }
  );

  const [useLiveLocation, setUseLiveLocation] = useState(false);
  const [operateWithoutLocation, setOperateWithoutLocation] = useState(
    initialLocation?.operates_without_location ?? false
  );

  const [selectedStateId, setSelectedStateId] = useState<string>('');

  type PlacePrediction = {
    description: string;
    place_id?: string;
    place?: string;
    structured_formatting?: {
      main_text?: string;
      secondary_text?: string;
    };
  };

  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);

  const createSessionToken = useCallback(() => {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2);
  }, []);

  const [sessionToken, setSessionToken] = useState<string>(() =>
    createSessionToken()
  );
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSessionToken(createSessionToken());
  }, [createSessionToken]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialLocation?.state && states.length > 0 && !selectedStateId) {
      const foundState = states.find(s => s.name === initialLocation.state);
      if (foundState) {
        setSelectedStateId(foundState.id.toString());
      }
    }
  }, [states, initialLocation?.state, selectedStateId]);

  const updateLocation = (
    field: keyof CreateListingLocation,
    value: string | number
  ) => {
    const newLocation = { ...location, [field]: value };
    setLocalLocation(newLocation);
    setLocation(newLocation);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;

        let resolvedAddress: string | undefined = location.address;
        let resolvedState: string | undefined = location.state;

        try {
          const response = await fetch('/api/google/reverse-geocode', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (response.ok) {
            const data = await response.json();
            resolvedAddress = data.address ?? resolvedAddress;
            resolvedState = data.state ?? resolvedState;
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
        }

        const updatedLocation: CreateListingLocation = {
          ...location,
          address: resolvedAddress ?? location.address,
          latitude,
          longitude,
          state: resolvedState ?? location.state,
        };

        setLocalLocation(updatedLocation);
        setLocation(updatedLocation);

        if (resolvedState) {
          const foundState = states.find(
            state => state.name.toLowerCase() === resolvedState.toLowerCase()
          );
          if (foundState) {
            setSelectedStateId(foundState.id.toString());
          }
        }
      },
      error => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please enter it manually.');
      }
    );
  };

  const fetchPredictions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setPredictions([]);
        setShowPredictions(false);
        return;
      }

      setIsLoadingPredictions(true);

      try {
        const response = await fetch('/api/google/places-autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: query,
            sessionToken,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Places autocomplete request failed: ${response.status}`
          );
        }

        const data = await response.json();
        const items = Array.isArray(data.predictions)
          ? (data.predictions as PlacePrediction[])
          : [];

        setPredictions(items);
        setShowPredictions(items.length > 0);
      } catch (error) {
        console.error('Places autocomplete error:', error);
        setPredictions([]);
        setShowPredictions(false);
      } finally {
        setIsLoadingPredictions(false);
      }
    },
    [sessionToken]
  );

  const handleAddressChange = (value: string) => {
    updateLocation('address', value);

    if (operateWithoutLocation) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (value.trim().length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      const query = location.state ? `${value}, ${location.state}` : value;
      void fetchPredictions(query);
    }, 300);
  };

  const selectPrediction = async (prediction: PlacePrediction) => {
    const resolvedPlaceId =
      prediction.place_id ?? prediction.place?.replace(/^places\//, '');

    if (!resolvedPlaceId) {
      return;
    }

    setIsLoadingPredictions(true);

    try {
      const response = await fetch('/api/google/place-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeId: resolvedPlaceId,
          sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Place details request failed: ${response.status}`);
      }

      const data = await response.json();

      const updatedLocation: CreateListingLocation = {
        ...location,
        address:
          data.formattedAddress ?? prediction.description ?? location.address,
        latitude:
          data.latitude === null
            ? undefined
            : (data.latitude ?? location.latitude),
        longitude:
          data.longitude === null
            ? undefined
            : (data.longitude ?? location.longitude),
        state: data.state ?? location.state,
      };

      setLocalLocation(updatedLocation);
      setLocation(updatedLocation);

      if (data.state) {
        const foundState = states.find(
          state => state.name.toLowerCase() === data.state.toLowerCase()
        );
        if (foundState) {
          setSelectedStateId(foundState.id.toString());
        }
      }

      setPredictions([]);
      setShowPredictions(false);
      setSessionToken(createSessionToken());
    } catch (error) {
      console.error('Place details lookup failed:', error);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const handleStateChange = (stateId: string) => {
    const selectedState = states.find(state => state.id.toString() === stateId);
    if (selectedState) {
      setSelectedStateId(stateId);
      updateLocation('state', selectedState.name);
    }
  };

  const handleOperateWithoutLocationChange = (checked: boolean) => {
    setOperateWithoutLocation(checked);
    const newLocation: CreateListingLocation = {
      ...location,
      operates_without_location: checked,
      address: checked ? '' : location.address,
      latitude: checked ? undefined : location.latitude,
      longitude: checked ? undefined : location.longitude,
    };
    setLocalLocation(newLocation);
    setLocation(newLocation);

    if (checked) {
      setPredictions([]);
      setShowPredictions(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  };

  return (
    <div className='mx-auto max-w-xl space-y-6'>
      <SelectSingleSimple
        label='Select state'
        name='state'
        value={selectedStateId}
        onChange={value => handleStateChange(value)}
        options={states?.map(state => ({
          value: state.id.toString(),
          label: state.name,
        }))}
        valueKey='value'
        labelKey='label'
        placeholder='Select state'
        isLoadingOptions={statesLoading}
      />

      {/* Address Input with Autocomplete */}
      <div className='space-y-2'>
        <label
          htmlFor='address'
          className='flex justify-between text-sm font-medium text-[#0F172B]'
        >
          Where's your business located?
          {!operateWithoutLocation && (
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='useLiveLocation'
                checked={useLiveLocation}
                onChange={e => {
                  setUseLiveLocation(e.target.checked);
                  if (e.target.checked) {
                    getCurrentLocation();
                  }
                }}
                className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
              />
              <label
                htmlFor='useLiveLocation'
                className='text-sm text-purple-600'
              >
                Use live location
              </label>
            </div>
          )}
        </label>
        <div className='relative'>
          <MapPin
            size={20}
            className={`absolute left-3 top-1/2 -translate-y-1/2 transform ${
              operateWithoutLocation ? 'text-gray-400' : 'text-black'
            }`}
          />
          <Input
            id='address'
            placeholder={
              operateWithoutLocation
                ? 'Address not required for mobile/online services'
                : 'Start typing your address...'
            }
            value={location.address}
            onChange={e => handleAddressChange(e.target.value)}
            onFocus={() => {
              if (predictions.length > 0) {
                setShowPredictions(true);
              }
            }}
            className='pl-10'
            disabled={operateWithoutLocation}
            autoComplete='off'
          />

          {/* Autocomplete Predictions Dropdown */}
          {showPredictions && !operateWithoutLocation && (
            <div className='absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg'>
              {isLoadingPredictions ? (
                <div className='p-3 text-center text-sm text-gray-500'>
                  Searching...
                </div>
              ) : predictions.length > 0 ? (
                <ul className='max-h-60 overflow-auto'>
                  {predictions.map(prediction => (
                    <li
                      key={prediction.place_id}
                      onClick={() => selectPrediction(prediction)}
                      className='cursor-pointer border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-50'
                    >
                      <div className='flex items-start'>
                        <MapPin size={16} className='mr-2 mt-1 text-gray-400' />
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-900'>
                            {prediction.structured_formatting?.main_text ??
                              prediction.description}
                          </div>
                          <div className='text-xs text-gray-500'>
                            {prediction.structured_formatting?.secondary_text ??
                              ''}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className='p-3 text-center text-sm text-gray-500'>
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!operateWithoutLocation &&
        location.address &&
        location.latitude &&
        location.longitude && (
          <Card className='p-4'>
            <div className='space-y-2'>
              {googleMapsApiKey && location.latitude && location.longitude && (
                <iframe
                  width='100%'
                  height='200'
                  style={{ border: 0, borderRadius: '0.5rem' }}
                  loading='lazy'
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${location.latitude},${location.longitude}&zoom=15`}
                />
              )}
            </div>
          </Card>
        )}

      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='operateWithoutLocation'
          checked={operateWithoutLocation}
          onChange={e => handleOperateWithoutLocationChange(e.target.checked)}
          className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
        />
        <label
          htmlFor='operateWithoutLocation'
          className='text-sm text-gray-500'
        >
          I operate without a physical location (mobile or online services
          only).
        </label>
      </div>
    </div>
  );
};

export default BusinessLocationForm;
