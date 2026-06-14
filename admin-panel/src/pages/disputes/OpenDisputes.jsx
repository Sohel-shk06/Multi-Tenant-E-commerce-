import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { DisputeList } from './DisputeList';

export const OpenDisputes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch only open disputes
    dispatch(fetchDisputes({ 
      page: 1, 
      status: 'open' 
    }));
  }, [dispatch]);

  return (
    <div>
      <DisputeList />
    </div>
  );
};