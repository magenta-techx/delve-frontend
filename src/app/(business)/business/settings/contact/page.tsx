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
  FacebookIcon,
  InstagramIcon,
  WhatsappIcon,
  TikTokIcon,
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
    icon: <WhatsappIcon />,
    color: 'bg-green-500',
  },
  {
    id: 'instagram',
    name: 'Instagram Link',
    icon: <InstagramIcon />,
    color: 'bg-pink-500',
  },
  {
    id: 'facebook',
    name: 'Facebook Link',
    icon: <FacebookIcon />,
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
    icon: <TikTokIcon />,
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
        <LogoLoadingIcon/>
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
                            <div className='text-xs text-[#FCFCFD]0'>
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
                  className='flex flex-col grid-cols-[1fr,150px] gap-2 justify-between lg:grid lg:items-end'
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
                        <div className='mt-1 p-3 border rounded-xl bg-[#FCFCFD]'>
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
