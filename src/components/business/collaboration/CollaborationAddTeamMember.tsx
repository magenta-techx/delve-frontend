import CancleIcon from '@/assets/icons/CancelIcon'
import Input from '@/components/ui/Input'
import { emailSchema } from '@/schemas/authSchema'
import { emailValidator } from '@/utils/validators'
import { Form, Formik } from 'formik'
import React from 'react'


interface CollaborationAddTeamMemberProps{
    setAddTeamMemberInput:(value:boolean)=> void
}
const CollaborationAddTeamMember = ({setAddTeamMemberInput}:CollaborationAddTeamMemberProps):JSX.Element => {
  return (
      <Formik
          initialValues={{ email: '' }}
            validationSchema={emailSchema}
          onSubmit={value => console.log(value)
          }
      >
          {({ errors, isSubmitting }) => (
              <Form className='w-full'>

                 

                  {isSubmitting && "Loading"}

                  {/* Fields */}
                  <div className='mb-2 flex w-full relative h-[52px] flex-col gap-3'>
                      {/* Group Field */}
                      <Input
                          name='email'
                          type='email'
                          placeholder='Enter group name'
                          inputClass='pl-20 py-4 text-xs'
                          icon={<button onClick={()=>setAddTeamMemberInput(false)}><CancleIcon /></button>}
                          iconPosition='left'
                        validate={emailValidator}
                      />
                      <button type='submit' disabled={errors.email ? false: true} className={`w-[122px] h-[45px] top-[2.5px] border-[1px] border-[#EEF2F6] rounded-md text-sm ${errors.email ? "text-[#9AA4B2] bg-[#F8FAFC] ":"text-white bg-primary"} absolute right-[2.5px]`}>Send Invite</button>
                  </div>
              </Form>
          )}
      </Formik>

  )
}

export default CollaborationAddTeamMember