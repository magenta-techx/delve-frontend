// Example of how to use the CreateServices component in a parent component

import React, { useState } from 'react';
import CreateServices from './CreateListingFormStep5Services';

interface Service {
  title: string;
  description: string;
  image: File | null;
  imagePreview?: string;
}

const ExampleParentComponent = () => {
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Method 1: Track services changes in real-time
  const handleServicesChange = (services: Service[]) => {
    setCurrentServices(services);
    console.log('Services updated:', services);
  };

  // Method 2: Handle final submission
  const handleServicesSubmit = async (services: Service[]) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting services:', services);
      
      // Convert to FormData if you need to send files
      const formData = new FormData();
      
      services.forEach((service, index) => {
        formData.append(`services[${index}][title]`, service.title);
        formData.append(`services[${index}][description]`, service.description);
        if (service.image) {
          formData.append(`services[${index}][image]`, service.image);
        }
      });

      // Example API call
      const response = await fetch('/api/services', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Services submitted successfully!');
        // Handle success (e.g., redirect, show success message)
      } else {
        console.error('Failed to submit services');
      }
    } catch (error) {
      console.error('Error submitting services:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Method 3: Submit services manually (if you don't want the submit button in the component)
  const manualSubmit = () => {
    const validServices = currentServices.filter(service => 
      service.title.trim() !== '' && service.description.trim() !== ''
    );
    
    if (validServices.length > 0) {
      handleServicesSubmit(validServices);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create Your Services</h1>
      
      {/* Option 1: With automatic submit button */}
      <CreateServices
        onServicesChange={handleServicesChange}
        onSubmit={handleServicesSubmit}
      />

      {/* Option 2: With manual submit button */}
      {/* 
      <CreateServices
        onServicesChange={handleServicesChange}
      />
      
      <div className="mt-6">
        <button
          onClick={manualSubmit}
          disabled={isSubmitting || currentServices.filter(s => s.title.trim() && s.description.trim()).length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit All Services'}
        </button>
      </div>
      */}

      {/* Debug info */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Current Services State:</h3>
        <pre className="text-sm mt-2">
          {JSON.stringify(currentServices.map(s => ({
            title: s.title,
            description: s.description,
            hasImage: !!s.image
          })), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ExampleParentComponent;