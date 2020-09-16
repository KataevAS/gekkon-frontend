import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { css } from '@/v2/aphrodite';
import LikeButton from '../../LikeButton/LikeButton';
import styles from './styles';

const mapIndexed = R.addIndex(R.map);

const PhotoGallery = ({ photos }) => {
  const [selectedPhotoIndex, setselectedPhotoIndex] = useState(0);

  return (
    <div className={css(styles.container)}>
      <div
        className={css(styles.displayedPhoto)}
        style={{ backgroundImage: `url(${photos[selectedPhotoIndex]?.url})` }}
      >
        <div className={css(styles.likeButtonContainer)}>
          <LikeButton onChange={() => {}} numOfLikes={57} bold />
        </div>
      </div>
      <div
        className={css(styles.previewPhotoContainer)}
      >
        {
          mapIndexed(
            (p, index) => (
              <div
                role="button"
                tabIndex={0}
                key={index}
                className={
                  css(
                    styles.previewPhoto,
                    index !== selectedPhotoIndex && styles.previewphotoInactive,
                  )
                }
                style={{ backgroundImage: `url(${p?.url})` }}
                onClick={() => setselectedPhotoIndex(index)}
              />
            ),
            photos,
          )
        }
      </div>
    </div>
  );
};

PhotoGallery.propTypes = { photos: PropTypes.array };
PhotoGallery.defaultProps = { photos: [] };

export default PhotoGallery;
