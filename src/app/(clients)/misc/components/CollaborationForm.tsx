'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Button } from '@/components/ui';

const collaborationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  business_id: z.array(z.number()).default([]).optional(),
});
type CollaborationFormData = z.infer<typeof collaborationSchema>;

export default function CollaborationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
    defaultValues: {
      name: '',
      description: '',
      business_id: [],
    },
  });

  const onSubmit = async (data: CollaborationFormData) => {
    
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Name
        </label>
        <Input
          id='name'
          {...register('name')}
          placeholder='Enter name'
          className='mt-1'
          haserror={!!errors.name}
        />
        {errors.name && (
          <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
          Description
        </label>
        <Textarea
          id='description'
          {...register('description')}
          placeholder='Enter description'
          rows={4}
          className='mt-1'
          haserror={!!errors.description}
        />
        {errors.description && (
          <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>
        )}
      </div>

      <Button type='submit' disabled={isSubmitting} isloading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
