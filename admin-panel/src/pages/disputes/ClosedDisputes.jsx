import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { DisputeList } from './DisputeList';

export const ClosedDisputes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch only closed disputes
    dispatch(fetchDisputes({ 
      page: 1, 
      status: 'closed' 
    }));
  }, [dispatch]);

  return (
    <div>
      <DisputeList />
    </div>
  );
};