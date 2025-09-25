'use client';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ImageOne from '@/assets/auth/images/auth-image1.png';

const AuthCarousel = (): JSX.Element => {
  const CAROUSEL_CONTENT = [
    {
      imageUrl: ImageOne,
      header: 'Explore What’s Around',
      subheader:
        'Delve connects you to reliable businesses for every moment, every need.',
    },
    {
      imageUrl: ImageOne,
      header: 'Your grocery run, made smarter',
      subheader:
        'Skip the stress, discover stores, check hours and shop with confidence ',
    },
    {
      imageUrl: ImageOne,
      header: 'Make moments that matter',
      subheader:
        'From weddings, to birthdays, Delve helps you plan every detail beautifully.',
    },
  ];

  return (
    <Carousel
      showThumbs={false}
      showStatus={false}
      showArrows={false}
      infiniteLoop
      autoPlay
      animationHandler='fade'
      interval={4000}
      transitionTime={4000}  
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        const baseStyle = {
          width: isSelected ? 46 : 3,
          height: isSelected ? 3 : 3,
          background: '#A48AFB',
          borderRadius: '30px',
          display: 'inline-block',
          margin: '2px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        };

        return (
          <span
            style={baseStyle}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            // value={index}
            key={index}
            role='button'
            tabIndex={0}
            aria-label={`${label} ${index + 1}`}
          />
        );
      }}
      className='h-[90vh] rounded-xl w-full'
    >
      {CAROUSEL_CONTENT.map((content, key) => (
        <div key={key} className='w-full'>
          <Image
            src={content.imageUrl}
            alt={`Delve ${content.header}`}
            width={300}
            height={200}
            priority
            className='h-[84vh] w-full rounded-tl-xl rounded-tr-xl'
          />

          <div className='h-[120px] w-full rounded-bl-xl rounded-br-xl bg-black pb-5 pl-4 pt-2 text-left font-karma text-white'>
            <h1 className='text-[17px] leading-9'>{content.header}</h1>
            <p className='w-[300px] text-[13px] leading-4'>
              {content.subheader}
            </p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default AuthCarousel;
