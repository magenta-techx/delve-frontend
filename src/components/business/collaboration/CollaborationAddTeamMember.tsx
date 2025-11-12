import CancleIcon from '@/assets/icons/CancelIcon';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { inviteMemberSchema, type InviteMemberInput } from '@/schemas/collaborationSchema';

interface CollaborationAddTeamMemberProps {
  setAddTeamMemberInput: (value: boolean) => void;
}
const CollaborationAddTeamMember = ({
  setAddTeamMemberInput,
}: CollaborationAddTeamMemberProps): JSX.Element => {
  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: '' },
    mode: 'onTouched',
  });

  const onSubmit = (values: InviteMemberInput): void => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
        {/* Fields */}
        <div className='relative mb-2 flex h-[52px] w-full flex-col gap-3'>
          {/* Email Field */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter email address'
                    className='pl-20 py-4 text-xs'
                    leftIcon={
                      <button type='button' onClick={() => setAddTeamMemberInput(false)}>
                        <CancleIcon />
                      </button>
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type='submit'
            disabled={!form.formState.isValid}
            className={`top-[2.5px] h-[45px] w-[122px] rounded-md border-[1px] border-[#EEF2F6] text-sm ${!form.formState.isValid ? 'bg-[#F8FAFC] text-[#9AA4B2]' : 'bg-primary text-white'} absolute right-[2.5px]`}
          >
            Send Invite
          </button>
        </div>
      </form>
    </Form>
  );
};

export default CollaborationAddTeamMember;
