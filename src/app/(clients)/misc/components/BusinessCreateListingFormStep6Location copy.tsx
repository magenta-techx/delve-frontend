// "use client"
// import type React from "react"
// import { useState, useEffect } from "react"
// import { MapPin } from "lucide-react"
// import { Card } from "@/components/ui"
// import { useBusinessStates } from "@/app/(business)/misc/api/business"
// import SelectSingleSimple from "@/components/ui/SelectSingleSimple"
// import LocationSearch from "./LocationSearch"
// import type { CreateListingLocation } from "./BusinessCreateListingForm"

// interface BusinessLocationFormProps {
//   setLocation: (location: CreateListingLocation) => void
//   initialLocation?: CreateListingLocation | undefined
// }

// const BusinessLocationForm: React.FC<BusinessLocationFormProps> = ({ setLocation, initialLocation }) => {
//   const { data: statesData, isLoading: statesLoading } = useBusinessStates()
//   const states = statesData || []

//   const [location, setLocalLocation] = useState<CreateListingLocation>(
//     initialLocation ?? {
//       address: "",
//       state: "",
//       operates_without_location: false,
//     },
//   )

//   const [useLiveLocation, setUseLiveLocation] = useState(false)
//   const [operateWithoutLocation, setOperateWithoutLocation] = useState(
//     initialLocation?.operates_without_location ?? false,
//   )

//   // Track selected state ID separately for the select component
//   const [selectedStateId, setSelectedStateId] = useState<string>("")

//   // Update selectedStateId when states data loads and we have an initial location
//   useEffect(() => {
//     if (initialLocation?.state && states.length > 0 && !selectedStateId) {
//       const foundState = states.find((s) => s.name === initialLocation.state)
//       if (foundState) {
//         setSelectedStateId(foundState.id.toString())
//       }
//     }
//   }, [states, initialLocation?.state, selectedStateId])

//   const updateLocation = (field: keyof CreateListingLocation, value: string | number) => {
//     const newLocation = { ...location, [field]: value }
//     setLocalLocation(newLocation)
//     setLocation(newLocation)
//   }

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords

//           const newLocation = {
//             ...location,
//             latitude,
//             longitude,
//           }

//           setLocalLocation(newLocation)
//           setLocation(newLocation)
//         },
//         (error) => {
//           console.error("Error getting current location:", error)
//         },
//       )
//     }
//   }

//   const handleStateChange = (stateId: string) => {
//     // Find the state name from the ID
//     const selectedState = states.find((state) => state.id.toString() === stateId)
//     if (selectedState) {
//       setSelectedStateId(stateId)
//       updateLocation("state", selectedState.name)
//     }
//   }

//   const handleLocationSelect = (selectedLocation: any) => {
//     const newLocation = {
//       ...location,
//       address: selectedLocation.name,
//       latitude: selectedLocation.latitude,
//       longitude: selectedLocation.longitude,
//     }

//     setLocalLocation(newLocation)
//     setLocation(newLocation)
//   }

//   const handleOperateWithoutLocationChange = (checked: boolean) => {
//     setOperateWithoutLocation(checked)
//     const newLocation: CreateListingLocation = {
//       ...location,
//       operates_without_location: checked,
//       address: checked ? "" : location.address,
//       latitude: checked ? undefined : location.latitude,
//       longitude: checked ? undefined : location.longitude,
//     }
//     setLocalLocation(newLocation)
//     setLocation(newLocation)
//   }

//   return (
//     <div className="mx-auto max-w-xl space-y-6">
//       <SelectSingleSimple
//         label="Select state"
//         name="state"
//         value={selectedStateId}
//         onChange={(value) => handleStateChange(value)}
//         options={states.map((state) => ({
//           value: state.id.toString(),
//           label: state.name,
//         }))}
//         valueKey="value"
//         labelKey="label"
//         placeholder="Select state"
//         isLoadingOptions={statesLoading}
//       />

//       {/* Address Input */}
//       <div className="space-y-2">
//         <label htmlFor="address" className="flex justify-between text-sm font-medium text-[#0F172B]">
//           Where's your business located?
//           {!operateWithoutLocation && (
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="useLiveLocation"
//                 checked={useLiveLocation}
//                 onChange={(e) => {
//                   setUseLiveLocation(e.target.checked)
//                   if (e.target.checked) {
//                     getCurrentLocation()
//                   }
//                 }}
//                 className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//               />
//               <label htmlFor="useLiveLocation" className="text-sm text-purple-600">
//                 Use live location
//               </label>
//             </div>
//           )}
//         </label>

//         {!operateWithoutLocation ? (
//           <LocationSearch
//             value={location.address}
//             onSelect={handleLocationSelect}
//             placeholder="Search for a location..."
//           />
//         ) : (
//           <div className="relative">
//             <MapPin size={20} className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
//             <input
//               type="text"
//               placeholder="Address not required for mobile/online services"
//               value={location.address}
//               disabled
//               className="w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground disabled:opacity-50"
//             />
//           </div>
//         )}
//       </div>

//       {/* Show map when address is entered and not operating without location */}
//       {!operateWithoutLocation && location.address && location.state && (
//         <Card className="p-4">
//           <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
//             <div className="text-center text-gray-500">
//               <MapPin size={24} className="mx-auto mb-2" />
//               <p className="text-sm">Location confirmed</p>
//               <p className="text-xs">
//                 {location.address}, {location.state}
//               </p>
//               {location.latitude && location.longitude && (
//                 <p className="mt-1 text-xs text-gray-400">
//                   {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
//                 </p>
//               )}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Operate without physical location */}
//       <div className="flex items-center space-x-2">
//         <input
//           type="checkbox"
//           id="operateWithoutLocation"
//           checked={operateWithoutLocation}
//           onChange={(e) => handleOperateWithoutLocationChange(e.target.checked)}
//           className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
//         />
//         <label htmlFor="operateWithoutLocation" className="text-sm text-gray-500">
//           I operate without a physical location (mobile or online services only).
//         </label>
//       </div>
//     </div>
//   )
// }

// export default BusinessLocationForm
