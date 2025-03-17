import React from 'react';

const Card = ({ icon: Icon, title, value }) => {
  return (
    <div className='bg-gray-200 p-4 rounded-lg shadow-md dark:bg-gray-700'>
      <div className='flex items-center'>
        <div className='p-3 bg-blue-100 rounded-full text-green-500 dark:bg-blue-900 dark:text-blue-300'>
          <Icon className='h-6 w-6' />
        </div>
        <div className='ml-4'>
          <h4 className='text-lg font-semibold dark:text-white'>{title}</h4>
          <p className='text-gray-600 dark:text-gray-300'>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
