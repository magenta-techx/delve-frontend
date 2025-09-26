import React from 'react'

const ListingUserMenuExtension = (): JSX.Element => {
    const LISTING_ITEMS = [
        
        {
            title: 'Lifestyle and wellnes',
            category: [
                {
                    title: 'Beauty & Personal Care',
                    description: 'Hair care, Makeup, Salons, Skincare ,spa'
                }
            ]
        }
    ]
  return (
      <div className='mt-8'>
          <h1 className='font-inter text-[32px] font-extrabold'>Browsers Category</h1>
          
          {/* {LISTING_ITEMS.map((item))=>(
            <div key={item.}></div>
          )} */}
    </div>
  )
}

export default ListingUserMenuExtension