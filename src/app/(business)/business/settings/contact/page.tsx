'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useBusinessContext } from '@/contexts/BusinessContext';
import { Button, Input } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';
import {
  useBusinessStates,
  useUpdateLocationAndContact,
} from '@/app/(business)/misc/api/business';
import SelectSingleSimple from '@/components/ui/SelectSingleSimple';
import {
  TwitterIcon,
  LogoLoadingIcon,
} from '@/assets/icons';

interface LocationInfo {
  address: string;
  state: string;
  latitude?: number;
  longitude?: number;
  operates_without_location?: boolean;
}

interface ContactInfo {
  phone_number: string;
  registration_number: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  tiktok_link?: string;
}

const SOCIAL_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'Whatsapp Link',
    icon: (
      <svg
        width='19'
        height='18'
        viewBox='0 0 19 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M1.32194 17.7406L1.77832 14.5459L0.938736 12.8667C-0.671287 9.6467 -0.180481 5.77354 2.18184 3.05687C5.50454 -0.764238 11.343 -1.04263 15.0142 2.445L15.2702 2.68819C17.1759 4.49861 18.1772 7.06314 18.0023 9.68588C17.629 15.2851 12.2011 19.1243 6.79729 17.6112L4.77832 17.0459L1.57487 17.9612C1.43555 18.001 1.30145 17.884 1.32194 17.7406ZM5.08978 5.5429L4.71891 6.4116C4.42104 7.10928 4.3228 7.88567 4.6112 8.58755C4.95763 9.43064 5.62155 10.629 6.8505 11.7246C8.07945 12.8202 9.34378 13.3408 10.2191 13.5868C10.9478 13.7917 11.7048 13.6026 12.3605 13.2239L13.2042 12.7365C13.7761 12.4062 13.8657 11.6146 13.3821 11.1637L12.7352 10.5445C12.3784 10.2118 11.8308 10.1963 11.4562 10.5084C11.0361 10.8585 10.1211 11.3239 9.64351 11.0579C9.35851 10.8992 8.68066 10.3768 8.46102 10.181C8.20617 9.95377 7.57479 9.28097 7.36779 8.98203C7.10338 8.60018 7.40485 7.73217 7.58727 7.30492L7.70188 7.04046C7.86802 6.65132 7.76929 6.20093 7.45375 5.91964L6.64239 5.19529C6.14202 4.74923 5.35324 4.92583 5.08978 5.5429Z'
          fill='#66C61C'
        />
      </svg>
    ),
    color: 'bg-green-500',
  },
  {
    id: 'instagram',
    name: 'Instagram Link',
    icon: (
      <svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M10 14C11.933 14 13.5 12.433 13.5 10.5C13.5 8.567 11.933 7 10 7C8.067 7 6.5 8.567 6.5 10.5C6.5 12.433 8.067 14 10 14Z'
          fill='url(#paint0_linear_6777_18531)'
        />
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M0 10C0 6.26154 0 4.3923 0.803847 3C1.33046 2.08788 2.08788 1.33046 3 0.803847C4.3923 0 6.26154 0 10 0C13.7385 0 15.6077 0 17 0.803847C17.9121 1.33046 18.6695 2.08788 19.1962 3C20 4.3923 20 6.26154 20 10C20 13.7385 20 15.6077 19.1962 17C18.6695 17.9121 17.9121 18.6695 17 19.1962C15.6077 20 13.7385 20 10 20C6.26154 20 4.3923 20 3 19.1962C2.08788 18.6695 1.33046 17.9121 0.803847 17C0 15.6077 0 13.7385 0 10ZM10 15.5C12.7614 15.5 15 13.2614 15 10.5C15 7.73858 12.7614 5.5 10 5.5C7.23858 5.5 5 7.73858 5 10.5C5 13.2614 7.23858 15.5 10 15.5ZM14.5 6C15.3284 6 16 5.32843 16 4.5C16 3.67157 15.3284 3 14.5 3C13.6716 3 13 3.67157 13 4.5C13 5.32843 13.6716 6 14.5 6Z'
          fill='url(#paint1_linear_6777_18531)'
        />
        <defs>
          <linearGradient
            id='paint0_linear_6777_18531'
            x1='10'
            y1='0'
            x2='10'
            y2='20'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#CB30E0' />
            <stop offset='0.572115' stop-color='#FEC601' />
            <stop offset='1' stop-color='#FF0054' />
          </linearGradient>
          <linearGradient
            id='paint1_linear_6777_18531'
            x1='10'
            y1='0'
            x2='10'
            y2='20'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color='#CB30E0' />
            <stop offset='0.572115' stop-color='#FEC601' />
            <stop offset='1' stop-color='#FF0054' />
          </linearGradient>
        </defs>
      </svg>
    ),
    color: 'bg-pink-500',
  },
  {
    id: 'facebook',
    name: 'Facebook Link',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M2.80385 5C2 6.3923 2 8.26154 2 12C2 15.7385 2 17.6077 2.80385 19C3.33046 19.9121 4.08788 20.6695 5 21.1962C6.3923 22 8.26154 22 12 22C15.7385 22 17.6077 22 19 21.1962C19.9121 20.6695 20.6695 19.9121 21.1962 19C22 17.6077 22 15.7385 22 12C22 8.26154 22 6.3923 21.1962 5C20.6695 4.08788 19.9121 3.33046 19 2.80385C17.6077 2 15.7385 2 12 2C8.26154 2 6.3923 2 5 2.80385C4.08788 3.33046 3.33046 4.08788 2.80385 5ZM13.2826 9.98734C13.2826 9.25329 13.8958 8.65823 14.6522 8.65823H17V6H14.6522C12.383 6 10.5435 7.78519 10.5435 9.98734V12.0759H8V14.7342H10.5435V21H13.2826V14.7342H16.2174L16.6087 12.0759H13.2826V9.98734Z'
          fill='#1877F2'
        />
      </svg>
    ),
    color: 'bg-blue-600',
  },
  {
    id: 'twitter',
    name: 'Twitter Link',
    icon: <TwitterIcon />,
    color: 'bg-blue-400',
  },
  {
    id: 'tiktok',
    name: 'TikTok Link',
    icon: (
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M12 15.7512V2.15561C12 2.06812 12.0709 2 12.1584 2H15.1975C15.6663 2 16.0673 2.32786 16.2292 2.76789C16.7431 4.16529 17.9404 6.05929 20.0716 6.60884C20.5833 6.74079 21 7.1662 21 7.69467V9.5C21 10.0523 20.5503 10.5056 20.0014 10.4445C17.5644 10.1733 16 9 16 9V15.75C16 19.2018 13.2018 22 9.75 22C6.29822 22 3.5 19.2018 3.5 15.75V15.5053C3.5 12.1738 6.17352 9.45887 9.50462 9.40762C9.77697 9.40343 10 9.62306 10 9.89544V13.3148C10 13.4171 9.91709 13.5 9.81481 13.5H9.75C8.50736 13.5 7.5 14.5074 7.5 15.75C7.5 16.9926 8.50736 18 9.75 18C10.9926 18 12 16.9939 12 15.7512Z'
          fill='#363538'
        />
      </svg>
    ),
    color: 'bg-black',
  },
];

interface EditableField {
  id: string;
  value: string | string[];
  displayValue?: string | undefined;
}

export default function ContactPage() {
  const {
    currentBusiness,
    refetchBusinesses,
    isLoading: isLoadingBusinesses,
  } = useBusinessContext();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, EditableField>>(
    {}
  );

  // Location state
  const [location, setLocation] = useState<LocationInfo>({
    address: '',
    state: '',
    operates_without_location: false,
  });

  // Contact state
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone_number: '',
    registration_number: '',
    whatsapp_link: '',
    facebook_link: '',
    instagram_link: '',
    twitter_link: '',
    tiktok_link: '',
  });

  const [selectedStateId, setSelectedStateId] = useState<string>('');

  // Google Maps autocomplete state
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

  // Fetch states
  const { data: statesData, isLoading: statesLoading } = useBusinessStates();
  const states = statesData || [];

  // Mutations
  const updateLocationAndContactMutation = useUpdateLocationAndContact();

  const googleMapsApiKey = process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'] || '';

  // Initialize data from current business
  useEffect(() => {
    if (currentBusiness) {
      setLocation({
        address: currentBusiness.address || '',
        state: currentBusiness.state || '',
        operates_without_location: false,
      });

      setContactInfo({
        phone_number: currentBusiness.phone_number || '',
        registration_number: currentBusiness.registration_number || '',
        whatsapp_link: currentBusiness.whatsapp_link || '',
        facebook_link: currentBusiness.facebook_link || '',
        instagram_link: currentBusiness.instagram_link || '',
        twitter_link: currentBusiness.twitter_link || '',
        tiktok_link: currentBusiness.tiktok_link || '',
      });

      // Set selected state
      if (currentBusiness.state && states.length > 0) {
        const foundState = states.find(s => s.name === currentBusiness.state);
        if (foundState) {
          setSelectedStateId(foundState.id.toString());
        }
      }
    }
  }, [currentBusiness, states]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPredictions && !(event.target as Element).closest('.relative')) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPredictions]);

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setFieldValues({
      [field]: {
        id: field,
        value: currentValue,
      },
    });
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValues({});
  };

  const handleFieldChange = (fieldKey: string, newValue: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: {
        id: fieldKey,
        value: newValue,
        displayValue: prev[fieldKey]?.displayValue,
      },
    }));

    // Handle address autocomplete
    if (fieldKey === 'address') {
      handleAddressSearch(newValue);
    }
  };

  const handleAddressSearch = async (query: string) => {
    if (!query.trim() || !googleMapsApiKey) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search requests
    searchTimeoutRef.current = setTimeout(async () => {
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
            components: 'country:ng',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPredictions(data.predictions || []);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      } catch (error) {
        console.error('Autocomplete search failed:', error);
        setPredictions([]);
        setShowPredictions(false);
      } finally {
        setIsLoadingPredictions(false);
      }
    }, 300); // 300ms debounce
  };

  const handlePlaceSelect = async (prediction: PlacePrediction) => {
    try {
      // Set the selected address
      setFieldValues(prev => ({
        ...prev,
        address: {
          id: 'address',
          value: prediction.description,
        },
      }));

      // Hide predictions
      setShowPredictions(false);
      setPredictions([]);

      // Get place details including coordinates
      if (prediction.place_id) {
        const response = await fetch('/api/google/place-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeId: prediction.place_id,
            sessionToken,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Update location with coordinates and state if available
          setLocation(prev => ({
            ...prev,
            address: prediction.description,
            latitude: data.latitude,
            longitude: data.longitude,
            state: data.state || prev.state,
          }));

          // Update state selection if we got state info
          if (data.state && states.length > 0) {
            const foundState = states.find(
              state => state.name.toLowerCase() === data.state.toLowerCase()
            );
            if (foundState) {
              setSelectedStateId(foundState.id.toString());
              setFieldValues(prev => ({
                ...prev,
                state: {
                  id: 'state',
                  value: foundState.id.toString(),
                },
              }));
            }
          }
        }
      }

      // Generate new session token for next search
      setSessionToken(createSessionToken());
    } catch (error) {
      console.error('Place selection failed:', error);
      toast.error('Failed to get place details');
    }
  };

  const handleSave = async (field: string) => {
    const newValue = fieldValues[field]?.value as string;
    if (!currentBusiness?.id || !newValue) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let updateData: any = {};

      if (field === 'state') {
        const selectedState = states.find(
          state => state.id.toString() === newValue
        );
        if (selectedState) {
          updateData = { state: selectedState.name };
        }
      } else if (field === 'address') {
        updateData = {
          address: newValue,
          ...(location.latitude && { latitude: location.latitude }),
          ...(location.longitude && { longitude: location.longitude }),
        };
      } else if (field === 'phone_number') {
        updateData = { phone_number: newValue };
      } else if (field === 'registration_number') {
        updateData = { registration_number: newValue };
      } else {
        // Social media links
        updateData = { [field]: newValue };
      }

      await updateLocationAndContactMutation.mutateAsync(
        {
          business_id: currentBusiness.id,
          ...updateData,
        },
        {
          onSuccess: () => {
            toast.success('Updated successfully');
            setEditingField(null);
            setFieldValues({});
            refetchBusinesses();
          },
        }
      );
    } catch (error) {
      toast.error(`Failed to update: ${String(error)}`);
      refetchBusinesses();
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
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

        const updatedLocation: LocationInfo = {
          ...location,
          address: resolvedAddress ?? location.address,
          latitude,
          longitude,
          state: resolvedState ?? location.state,
        };

        setLocation(updatedLocation);

        // If we're editing address, update the field value
        if (editingField === 'address') {
          setFieldValues(prev => ({
            ...prev,
            address: {
              id: 'address',
              value: resolvedAddress ?? location.address,
            },
          }));
        }

        if (resolvedState) {
          const foundState = states.find(
            state => state.name.toLowerCase() === resolvedState.toLowerCase()
          );
          if (foundState) {
            setSelectedStateId(foundState.id.toString());
          }
        }

        toast.success('Location updated successfully');
      },
      error => {
        console.error('Error getting current location:', error);
        toast.error(
          'Unable to get your current location. Please enter it manually.'
        );
      }
    );
  };

  if (isLoadingBusinesses) {
    return (
      <div className='flex h-full min-h-[40vh] flex-col items-center justify-center text-center text-muted-foreground'>
        <LogoLoadingIcon />
      </div>
    );
  }

  return (
    <div className='lg:p-6'>
      <div className=''>
        {/* State */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>State</Label>

          {editingField === 'state' ? (
            <div className='flex-1'>
              <SelectSingleSimple
                name='state'
                value={(fieldValues['state']?.value as string) || ''}
                onChange={value => handleFieldChange('state', value)}
                options={states.map(state => ({
                  value: state.id.toString(),
                  label: state.name,
                }))}
                valueKey='value'
                labelKey='label'
                placeholder='Select state'
                isLoadingOptions={statesLoading}
              />
            </div>
          ) : (
            <div className='flex-1 rounded-xl border bg-[#FCFCFD] p-3'>
              <span className='text-sm text-gray-900'>
                {location.state || 'No state selected'}
              </span>
            </div>
          )}

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            {editingField === 'state' ? (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => handleSave('state')}
                  disabled={updateLocationAndContactMutation.isPending}
                >
                  {updateLocationAndContactMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleEdit('state', selectedStateId)}
              >
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Address */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Business Location
          </Label>

          {editingField === 'address' ? (
            <div className='flex-1'>
              <div className='relative'>
                <div className='relative'>
                  <MapPin
                    size={20}
                    className='absolute left-3 top-1/2 -translate-y-1/2 transform text-black'
                  />
                  <Input
                    placeholder='Start typing your address...'
                    value={(fieldValues['address']?.value as string) || ''}
                    onChange={e => handleFieldChange('address', e.target.value)}
                    className='pl-10'
                  />
                  {isLoadingPredictions && (
                    <Loader2 className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400' />
                  )}
                </div>

                {/* Autocomplete Predictions */}
                {showPredictions && predictions.length > 0 && (
                  <div className='absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg'>
                    {predictions.map((prediction, index) => (
                      <div
                        key={prediction.place_id || index}
                        onClick={() => handlePlaceSelect(prediction)}
                        className='flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-[#FCFCFD]'
                      >
                        <MapPin size={16} className='text-gray-400' />
                        <div className='flex-1'>
                          <div className='text-sm text-gray-900'>
                            {prediction.structured_formatting?.main_text ||
                              prediction.description}
                          </div>
                          {prediction.structured_formatting?.secondary_text && (
                            <div className='text-[#FCFCFD]0 text-xs'>
                              {prediction.structured_formatting.secondary_text}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Live Location Button */}
                <div className='mt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={getCurrentLocation}
                    className='flex items-center gap-2'
                  >
                    <MapPin size={16} />
                    Use Current Location
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex-1 rounded-xl border bg-[#FCFCFD] p-3'>
              <div className='flex items-center gap-2'>
                <MapPin size={16} className='text-[#FCFCFD]0' />
                <span className='text-sm text-gray-900'>
                  {location.address || 'No address set'}
                </span>
              </div>
            </div>
          )}

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            {editingField === 'address' ? (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => handleSave('address')}
                  disabled={updateLocationAndContactMutation.isPending}
                >
                  {updateLocationAndContactMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                variant='outline'
                onClick={() => handleEdit('address', location.address)}
              >
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Phone Number */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Phone Number
          </Label>

          {editingField === 'phone_number' ? (
            <div className='flex-1'>
              <Input
                placeholder='Enter phone number'
                value={(fieldValues['phone_number']?.value as string) || ''}
                onChange={e =>
                  handleFieldChange('phone_number', e.target.value)
                }
              />
            </div>
          ) : (
            <div className='flex-1 rounded-xl border bg-[#FCFCFD] p-3'>
              <span className='text-sm text-gray-900'>
                {contactInfo.phone_number || 'No phone number set'}
              </span>
            </div>
          )}

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            {editingField === 'phone_number' ? (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => handleSave('phone_number')}
                  disabled={updateLocationAndContactMutation.isPending}
                >
                  {updateLocationAndContactMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  handleEdit('phone_number', contactInfo.phone_number)
                }
              >
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Registration Number */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:py-8 xl:grid xl:items-center xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>
            Registration Number
          </Label>

          {editingField === 'registration_number' ? (
            <div className='flex-1'>
              <Input
                placeholder='Enter business registration number'
                value={
                  (fieldValues['registration_number']?.value as string) || ''
                }
                onChange={e =>
                  handleFieldChange('registration_number', e.target.value)
                }
              />
            </div>
          ) : (
            <div className='flex-1 rounded-xl border bg-[#FCFCFD] p-3'>
              <span className='text-sm text-gray-900'>
                {contactInfo.registration_number ||
                  'No registration number set'}
              </span>
            </div>
          )}

          <div className='mt-2 flex items-center lg:justify-end lg:self-end'>
            {editingField === 'registration_number' ? (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => handleSave('registration_number')}
                  disabled={updateLocationAndContactMutation.isPending}
                >
                  {updateLocationAndContactMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </Button>
                <Button size='sm' variant='outline' onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  handleEdit(
                    'registration_number',
                    contactInfo.registration_number
                  )
                }
              >
                Edit
              </Button>
            )}
          </div>
        </section>

        {/* Social Media Section */}
        <section className='flex grid-cols-[240px,1fr,150px] flex-col border-b-[0.7px] border-[#E3E8EF] p-4 lg:grid lg:py-8 xl:grid xl:items-start xl:gap-12'>
          <Label className='text-sm font-medium text-[#0F0F0F]'>Socials</Label>
          <div className='col-span-2 flex-1 space-y-4'>
            {SOCIAL_PLATFORMS.map(platform => {
              const linkField = `${platform.id}_link`;
              const currentValue =
                contactInfo[linkField as keyof ContactInfo] || '';

              return (
                <div
                  key={platform.id}
                  className='flex grid-cols-[1fr,150px] flex-col justify-between gap-2 lg:grid lg:items-end'
                >
                  <div className='flex flex-col gap-3 rounded-xl border bg-white p-3 lg:px-5'>
                    <Label className='flex items-center gap-2 text-sm font-normal text-[#697586]'>
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                    <div className='flex-1'>
                      {editingField === linkField ? (
                        <div className='mt-1'>
                          <Input
                            placeholder={`Enter your ${platform.name.toLowerCase()}`}
                            value={
                              (fieldValues[linkField]?.value as string) || ''
                            }
                            onChange={e =>
                              handleFieldChange(linkField, e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <div className='mt-1 rounded-xl border bg-[#FCFCFD] p-3'>
                          <span className='text-sm text-gray-600'>
                            {currentValue ||
                              `No ${platform.name.toLowerCase()} set`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 lg:justify-self-end'>
                    {editingField === linkField ? (
                      <>
                        <Button
                          size='sm'
                          onClick={() => handleSave(linkField)}
                          disabled={updateLocationAndContactMutation.isPending}
                        >
                          {updateLocationAndContactMutation.isPending
                            ? 'Saving...'
                            : 'Save'}
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(linkField, currentValue)}
                      >
                        {currentValue ? 'Edit' : 'Add'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div></div> {/* Empty div for grid alignment */}
        </section>
      </div>
    </div>
  );
}
