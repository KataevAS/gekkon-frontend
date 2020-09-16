import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@/v2/components/Button/Button';
import Modal from '../../../../layouts/Modal';
import { css } from '@/v2/aphrodite';
import styles from './styles';

const ContactModeratorForm = ({ submit, cancel }) => {
  const [msg, setMsg] = useState('');

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
          <h4 className={css(styles.noticeMessageTitle)}>Написать модератору</h4>
          <textarea
            className={css(styles.formTextarea)}
            value={msg}
            onChange={event => setMsg(event.target.value)}
          />
          <div className={css(styles.noticeMessageButtonBlock)}>
            <div className={css(styles.noticeMessageButtonCol)}>
              <Button
                size="small"
                style="gray"
                onClick={cancel}
              >
                Отмена
              </Button>
            </div>
            <div className={css(styles.noticeMessageButtonCol)}>
              <Button
                size="small"
                style="normal"
                onClick={() => submit({ msg })}
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

ContactModeratorForm.propTypes = {
  submit: PropTypes.func,
  cancel: PropTypes.func,
};

export default ContactModeratorForm;
