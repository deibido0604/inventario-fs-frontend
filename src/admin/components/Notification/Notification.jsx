import { notification } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeNotification } from '../../layout/store/layoutSlice';


export const Notification = () => {
  const [api, contextHolder] = notification.useNotification();
  const { message, description, placement, type, duration, show } = useSelector((state) =>  state.layout.notification);
  const dispatch = useDispatch();

  useEffect(() => {

    if (show) {
      openNotfication();
      setTimeout(() => {
        handleClose();
      }, duration || 3000);
    }
  }, [show]);
  
  const handleClose = () => {
    dispatch(closeNotification())
  }

  const openNotfication = () => {

    api[type]({
      message,
      description,
      placement,
      duration,
      onclose: handleClose
    });
  }
   
  return (
    <>
      {contextHolder}
    </>
  );
};

