import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import classnames from 'classnames/bind';
import Link from 'gatsby-link';

import leftArrow from './left-arrow.svg';
import styles from './product.module.styl';
import './product.styl';
import {
  currentImageSelector,
  currentQuantitySelector,
  currentSizeChanged,
  quantitiesSelector,
  quantityChanged,
  thumbnailClicked,
} from './redux';
import Selector from '../Selector';

const cx = classnames.bind(styles);
const createHandlerMemo = _.memoize((size, handler) => () => handler(size));
const mapStateToProps = createSelector(
  quantitiesSelector,
  currentQuantitySelector,
  currentImageSelector,
  (quantities, currentQuantity, currentImage) => ({
    quantities,
    currentQuantity,
    currentImage,
  }),
);

const mapDispatchToProps = (dispatch, props) => {
  const { data: { jamProduct: { thumbnails, sizes } } } = props;

  const sizeHandlers = bindActionCreators(
    sizes.reduce((s, size) => {
      s[size] = createHandlerMemo(size, currentSizeChanged);
      return s;
    }, {}),
    dispatch,
  );

  const thumbnailHandlers = bindActionCreators(
    _.reduce(
      thumbnails,
      (s, _, side) => {
        s[side] = createHandlerMemo(side, thumbnailClicked);
        return s;
      },
      {},
    ),
    dispatch,
  );

  return {
    sizeHandlers,
    thumbnailHandlers,
    quantityChanged: x =>
      dispatch(quantityChanged((x && x.value) || undefined)),
  };
};

export const productFragments = graphql`
  fragment Product_page on JAMProduct {
    name
    price
    sale
    description
    details
    sizes
    thumbnails {
      front {
        alt
        src
        srcSet
      }
      back {
        alt
        src
        srcSet
      }
      side {
        alt
        src
        srcSet
      }
    }
    images {
      front {
        alt
        src
        srcSet
      }
      back {
        alt
        src
        srcSet
      }
      side {
        alt
        src
        srcSet
      }
    }
  }
`;

const propTypes = {
  currentQuantity: PropTypes.number,
  currentImage: PropTypes.string,
  data: PropTypes.shape({
    jamProduct: PropTypes.shape({
      description: PropTypes.string,
      details: PropTypes.arrayOf(PropTypes.string),
      images: PropTypes.shape({
        back: PropTypes.object,
        front: PropTypes.object,
        side: PropTypes.object,
      }),
      name: PropTypes.string,
      price: PropTypes.string,
      sale: PropTypes.string,
      sizes: PropTypes.arrayOf(PropTypes.number).isRequired,
      thumbnails: PropTypes.shape({
        back: PropTypes.object,
        front: PropTypes.object,
        side: PropTypes.object,
      }),
    }).isRequired,
  }).isRequired,
  sizeHandlers: PropTypes.object,
  thumbnailHandlers: PropTypes.object,
  quantities: PropTypes.array,
  quantityChanged: PropTypes.func.isRequired,
};

export function Product({
  currentQuantity,
  currentImage,
  data: {
    jamProduct: {
      description,
      details,
      images,
      name,
      price,
      sale,
      sizes,
      thumbnails = {},
    },
  },
  sizeHandlers,
  thumbnailHandlers,
  quantities,
  quantityChanged,
}) {
  const isSale = !!sale;
  const Price = isSale ? 'del' : 'span';
  const _sale = isSale ?
    (
      <span className={ cx('sale') }>
        ${ sale }
      </span>
    ) :
    null;
  return (
    <div className={ cx('product') }>
      <div className={ cx('content') }>
        <div className={ cx('images') }>
          <div>
            <img
              alt='alt is set by content'
              className={ cx('main') }
              { ...images[currentImage] }
            />
          </div>
          <div className={ cx('thumbnails') }>
            { _.map(thumbnails, ({ alt, ...rest }, side) =>
              (
                <div
                  key={ side }
                  onClick={ thumbnailHandlers[side] }
                  onKeyDown={ thumbnailHandlers[side] }
                  role='button'
                  tabIndex='0'
                  >
                  <img
                    alt={ alt }
                    { ...rest }
                  />
                </div>
              ),
            ) }
          </div>
        </div>
        <div className={ cx('details') }>
          <header>
            <h1>
              { name }
            </h1>
          </header>
          <div className={ cx('price') }>
            <Price>${ price }</Price> { _sale }
          </div>
          <div className={ cx('description') }>
            { description }
          </div>
          <ul className={ cx('list') }>
            { details.map(detail =>
              (
                <li key={ detail }>
                  <small>
                    { detail }
                  </small>
                </li>
              ),
            ) }
          </ul>
          <hr />
          <div className='sizes'>
            <p>Size:</p>{ ' ' }
            { sizes.map(value =>
              (
                <button
                  className={ cx('button-size') }
                  key={ value }
                  onClick={ sizeHandlers[value] }
                  >
                  { value }
                </button>
              ),
            ) }
          </div>
          <div className={ cx('quantity') }>
            <div className={ cx('copy') }>Quantity </div>
            <Selector
              className={ cx('quantity-selector', 'selector') }
              onChange={ quantityChanged }
              options={ quantities }
              value={ currentQuantity }
            />
            <div>
              <button className={ cx('button') }>Add To Cart</button>
            </div>
          </div>
        </div>
      </div>
      <Link to='/women/shoes'>
        <div className={ cx('back') }>
          <img
            alt='A smal left pointing arrow'
            className={ cx('left-arrow') }
            src={ leftArrow }
          />
          Back to Shoes
        </div>
      </Link>
    </div>
  );
}

Product.displayName = 'Product';
Product.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Product);