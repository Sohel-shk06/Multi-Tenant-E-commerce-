import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDisputes } from '../../app/store/disputeSlice';
import { DisputeList } from './DisputeList';

export const OpenDisputes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDisputes({ page: 1, status: 'open' }));
  }, [dispatch]);

  return <DisputeList defaultStatus="open" />;
};