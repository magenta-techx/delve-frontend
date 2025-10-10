'use client'
import { BaseIcons } from "@/assets/icons/base/Icons";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
// import { signupSchema } from "@/schemas/authSchema";
// import { emailValidator } from "@/utils/validators";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page(): JSX.Element {
  const router = useRouter();

  const [passwordReset, setPasswordReset] = useState<boolean>(false)
  const [changePassword, setChangePassword] = useState<boolean>(false)
  // Signup Handler
  const handleSignup = async (values: {
    first_name: string;
    last_name: string;
    email: string;
    current_password: string;
  }): Promise<void> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      window.location.reload();
      router.push('/auth/signin-signup');
    } else {
      const data = await res.json();
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <main className='relative flex flex-col items-center overflow-x-hidden'>
      {/* <div className='relative flex sm:h-[83.5vh] h-[110vh] w-screen flex-col items-center bg-cover bg-no-repeat sm:bg-[url("/landingpage/landing-page-hero-image.jpg")]'> */}
      {/* New Navbar component  */}
      {/* <div className='sm:hidden flex'> */}
      {/* <NavbarLandingPage /> */}
      {/* </div>  */}
      {/* </div> */}

      <div className="sm:w-[1540px]">

        <div className=" mt-20 z-10">
        <div className="flex items-center justify-between w-full mb-4">
            <h1 className="text-[25px] font-semibold font-inter flex items-center gap-3"><BaseIcons value="user-logged-in-black" /><p>Profile Settings</p></h1>
          </div>

        </div>

        {/* Profile settings container  */}
        <div className="w-full flex items-start gap-[150px]">

          {/* Profile form  */}
          <div className="border-[1px] border-[#E3E8EF] sm:w-[853px] sm:h-[866px] rounded-3xl p-10 relative">

            {changePassword && <div className="backdrop-blur-sm bg-[#FFFFFF14] rounded-3xl absolute h-full w-full top-0 left-0 z-20"></div>}

            {/* Profile settings header  */}
            <div className="flex items-start justify-between mb-14">
              <div className="flex items-end gap-3">
                <div className="border-[2px] border-[#E3E8EF] rounded-full sm:w-[100px] sm:h-[100px] flex items-end justify-center relative">
                  <Image src={'/profile/person-graphics.jpg'} alt="Delve user profile" width={80} height={50} className="rounded-full" />
                </div>
                <button className="hover:bg-primary/40 sm:h-[40px] sm:w-[130px] border-[1px] border-[#D9D6FE] bg-primary/10 text-primary text-[14px] flex items-center justify-center rounded-md gap-2">Change profile</button>
              </div>
              <div className=" sm:h-[44px] sm:w-[194px] gap-2 bg-[#FFF4ED] text-[14px] flex items-center justify-center rounded-md"><span className="text-[#9AA4B2]">Joined</span> <span>24th June, 2025</span></div>
            </div>

            {/* Profile form  */}
            <div>
              <h1 className="text-[18px] font-semibold mb-10">Account Management</h1>

              <Formik
                initialValues={{
                  first_name: '',
                  last_name: '',
                  email: '',
                  current_password: '****************',
                  // confirm_password: '',
                }}
                // validationSchema={signupSchema}
                onSubmit={handleSignup}
              >
                {({ isSubmitting }) => (
                  <Form className='w-full'>


                    {/* Fields */}
                    <div className='flex w-full flex-col gap-2'>
                      {/* First name and last name  */}

                      <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
                        {/* first name  */}
                        <Input
                          name='first_name'
                          type='text'
                          placeholder='Enter first name'
                          label='First name'
                          className='w-full'
                        />

                        {/* last name  */}
                        <Input
                          name='last_name'
                          type='text'
                          placeholder='Enter last name'
                          label='Last name'
                          className='w-full'
                        />
                      </div>
                      {/* Email Field */}
                      <Input
                        disabled
                        name='email'
                        type='email'
                        placeholder='Enter Email'
                        label='Email address'
                      />

                      {/* Password Field */}
                      <Input
                        name='current_password'
                        type='text'
                        placeholder='Enter password'
                        label='Password'
                        disabled
                      />
                      {/* Confirm Password Field */}
                      {/* <Input
                        name='confirm_password'
                        type='password'
                        placeholder='Confirm password'
                        label='Confirm password'
                      /> */}
                    </div>

                    <button type="button" className="bg-[#EEF2F6] mb-10 sm:w-[128px] sm:h-[38px] rounded-lg border-[1px] border-[#E3E8EF] text-[12px] font-medium" onClick={() => {
                      setChangePassword(!changePassword)
                    }}>Change password</button>

                    {/* Submit Button */}
                    <div className="w-1/2">
                      <Button
                        type='submit'
                        disabled={!passwordReset}
                        isSubmitting={isSubmitting}
                      >
                        Save changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>


          {/* Profile change password  */}
          {
            changePassword && <div className="sm:w-[515px] pt-10">

              <div className="flex items-center justify-between mb-10">
                <h3 className="text-[18px] font-semibold">Change Password</h3>
                <button className="text-[#697586] text-[14px]" onClick={() => setChangePassword(!changePassword)}>Cancel</button>
              </div>
              <Formik
                initialValues={{
                  old_password: '',
                  new_password: '',
                }}
                // validationSchema={signupSchema} 
                onSubmit={(values) => {
                  alert(values);
                  setPasswordReset(!passwordReset)
                }}
              >
                {({ errors }) => (
                  <Form className='w-full'>


                    {/* Fields */}
                    <div className='flex w-full flex-col gap-2'>
                      {/* Email Field */}
                      <Input
                        name='old_password'
                        type='password'
                        placeholder='Enter old password'
                        label='Old password'
                      />

                      {/* Password Field */}
                      <Input
                        name='new_password'
                        type='password'
                        placeholder=''
                        label='New Password'

                      />
                      {/* Confirm Password Field */}
                      {/* <Input
                        name='confirm_password'
                        type='password'
                        placeholder='Confirm password'
                        label='Confirm password'
                      /> */}
                    </div>

                    {/* Submit Button */}
                    <div className="w-1/4">
                      <Button
                        type='submit'
                        disabled={errors?.new_password || errors?.old_password ? true
                          : false}
                      >
                        Changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          }

        </div>
      </div>




    </main>
  );
}
