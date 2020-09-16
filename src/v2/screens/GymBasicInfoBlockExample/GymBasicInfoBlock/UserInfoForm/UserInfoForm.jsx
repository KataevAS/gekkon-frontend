import React, { useState } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import Button from '@/v2/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import { reEmail } from '@/v1/Constants/Constraints';
import Modal from '../../../../layouts/Modal';
import { css } from '@/v2/aphrodite';
import styles from './styles';

const UserInfoForm = ({ submit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const check = (field, value) => {
    const msg = 'Должно быть заполнено хотя бы одно из полей email или телефон';
    switch (field) {
    case 'email':
      if (value !== '' && !R.test(reEmail, value)) {
        setErrors({ email: ['Неверный формат email'] });
        return false;
      }
      if (value === '' && phone === '') {
        setErrors({ email: [msg] });
        return false;
      }
      setErrors({});
      return true;
    case 'phone':
      if (value !== '' && value.length < 11) {
        setErrors({ phone: ['Неверный формат номера'] });
        return false;
      }
      if (value === '' && email === '') {
        setErrors({ phone: [msg] });
        return false;
      }
      setErrors({});
      return true;
    default:
      setErrors({});
      return true;
    }
  };

  const onPhoneChange = (event) => {
    setPhone(event.target.value);
    check('phone', event.target.value);
  };

  const onNameChange = (event) => {
    setName(event.target.value);
    setErrors({});
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
    check('email', event.target.value);
  };

  const checkAndSubmit = () => {
    let res = !check('email', email);
    res += !check('phone', phone);
    if (res > 0) {
      return;
    }
    submit({ name, email, phone });
  };

  const hasError = (field) => {
    return errors[field];
  };

  const errorText = (field) => {
    return R.join(
      ', ',
      errors[field] ? errors[field] : [],
    );
  };

  const fieldsChanged = () => (
    phone !== '' || name !== '' || email !== ''
  );

  return (
    <Modal maxWidth="360px">
      <form
        action="#"
        method="post"
        encType="multipart/form-data"
        role="button"
        tabIndex={0}
        className={css(styles.form)}
      >
        <div className={css(styles.modalBlockPaddingWrapper)}>
          <FormField
            placeholder="Имя"
            id="name"
            onChange={onNameChange}
            type="text"
            hasError={hasError('name')}
            errorText={errorText('name')}
            value={name}
          />
          <FormField
            placeholder="Email"
            id="email"
            onChange={onEmailChange}
            type="text"
            hasError={hasError('email')}
            errorText={errorText('email')}
            value={email}
          />
          <FormField
            placeholder="Телефон"
            id="phone"
            onChange={onPhoneChange}
            type="number"
            hasError={hasError('phone')}
            errorText={errorText('phone')}
            value={phone}
          />
          <Button
            size="medium"
            style="normal"
            fullLength
            submit
            disabled={!fieldsChanged()}
            onClick={checkAndSubmit}
          >
            Отправить
          </Button>
        </div>
      </form>
    </Modal>
  );
};

UserInfoForm.propTypes = { submit: PropTypes.func };

export default UserInfoForm;
