// 'use client';

// import { useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useDispatch } from 'react-redux';
// import { setBusinessData } from '@/redux/slices/businessSlice';

// export default function SessionWatcher() {
//   const { data: session } = useSession();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (session?.user) {
//       dispatch(
//         setBusinessData({
//           is_brand_owner: session.user?.is_brand_owner,
//           number_of_owned_brands: session.user?.number_of_owned_brands,
//           is_active: session.user?.is_active,
//           current_plan: session.user?.current_plan,
//           is_premium_plan_active: session.user?.is_premium_plan_active,
//         })
//       );
//     }
//   }, [session, dispatch]);

//   return null; // nothing to render
// }
