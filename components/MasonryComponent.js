import React, { Component, PropTypes } from 'react';
import { assign as _assign } from 'lodash';
import defaultProps from './defaultProps';

const isBrowser = typeof window !== 'undefined';
const Masonry = isBrowser ? ( Masonry || window.Masonry || require( 'masonry-layout' ) ) : null;
const imagesloaded = isBrowser ? require( 'imagesloaded' ) : null;

const refName = 'masonryContainer';

function getDiff ( listA, listB ) {
  // get differences between two lists
  return listA.filter( diffItem => !~listB.indexOf( diffItem ) )
}

function getPrepended ( diff, updated ) {
  // get everything added to the beginning of the DOMNode list
  let beginningIndex = 0;

  return diff.filter(
    newChild => {
      const prepend = beginningIndex === updated.indexOf( newChild );

      if ( prepend ) {
        // increase the index
        beginningIndex++;
      }

      return prepend;
    }
  );
}

/*
 * otherwise we reverse it because so we're going through the list picking off the items that
 * have been added at the end of the list. this complex logic is preserved in case it needs to be
 * invoked
  function getPrependedReverse ( diff, updated ) {
    let endingIndex = updated.length - 1;

    diff.reverse().filter(
      newChild => {
        const append = endingIndex = updated.indexOf( newChild );

        if ( append ) {
          endingIndex--;
        }

        return append;
      }
    )
  }
*/

function getAppended ( diff, prepended ) {
  // we assume that everything else is appended
  return diff.filter( el => prepended.indexOf( el ) === -1 );
}

function getMoved ( newChildren, oldChildren ) {
  // get everything added to the end of the DOMNode list
  return oldChildren.filter( ( child, index ) => index !== newChildren.indexOf( child ) );
}

export default class MasonryComponent extends Component {
  constructor ( props, context ) {
    super( props, context );

    this.displayName = 'MasonryComponent';
    this.state       = { mounted : false };
    this.domChildren = [];
    this.refs;
    this.masonry;
  }

  initializeMasonry ( force ) {
    if ( !this.masonry || force ) {
      this.masonry = new Masonry(
        this.refs[ refName ],
        this.props.options
      );

      this.domChildren = this.getNewDomChildren();
    }
  }

  getNewDomChildren ( node ) {
    if ( node ) {
      return Array.prototype.slice.call( this.props.options.itemSelector ? node.querySelectorAll( this.props.options.itemSelector ) : node.children );
    }
  }


  diffDomChildren ( ) {
    /*
     * take only elements attached to DOM
     * (aka the parent is the masonry container, not null)
     */
    const oldChildren = this.domChildren.filter( element => !!element.parentNode );
    const newChildren = this.getNewDomChildren( this.refs[ refName ] );

    const removed = getDiff( oldChildren, newChildren );
    const domDiff = getDiff( newChildren, oldChildren );
    const prepended = getPrepended( domDiff, newChildren );
    const appended  = getAppended(  domDiff, prepended );
    const moved = removed.length === 0 ? getMoved( newChildren, oldChildren ) : [];

    this.domChildren = newChildren;

    return {
      oldChildren,
      newChildren,
      removed,
      appended,
      prepended,
      moved
    };
  }

  performLayout ()  {
    const diff = this.diffDomChildren();

    if ( diff.removed.length > 0 ) {
      this.masonry.remove( diff.removed );
      this.masonry.reloadItems();
    }

    if ( diff.appended.length > 0 ) {
      this.masonry.appended( diff.appended );

      if ( diff.prepended.length === 0 ) {
        this.masonry.reloadItems();
      }
    }

    if ( diff.prepended.length > 0 ) {
      this.masonry.prepended( diff.prepended );
    }

    if ( diff.moved.length > 0 ) {
      this.masonry.reloadItems();
    }

    this.masonry.layout();
  }

  imagesLoaded ( ) {
    if ( this.props.disableImagesLoaded ) {
      return;
    }

    imagesloaded(
      this.refs[ refName ],
      instance => {
        if ( this.props.onImagesLoaded ) {
          this.props.onImagesLoaded( instance );
        }

        this.masonry.layout();
      }
    );
  }

  componentDidMount ( ) {
    this.initializeMasonry();
    this.imagesLoaded();
    this.state.mounted = true;
  }

  componentDidUpdate ( ) {
    this.performLayout();
    this.imagesLoaded();
  }

  componentWillReceiveProps ( ) {
    this._timer = setTimeout( ( ) => {
      this.masonry.reloadItems();
      this.state.mounted && this.forceUpdate();
    } );
  }

  componentWillUnmount ( ) {
    clearTimeout( this._timer );
    this.masonry.destroy();
    this.state.mounted = false;
  }

  render ( ) {
    return React.createElement( this.props.elementType, _assign( {}, this.props, { ref: refName } ), this.props.children );
  }
}

MasonryComponent.propTypes = {
  disableImagesLoaded: PropTypes.bool,
  onImagesLoaded:      PropTypes.func,
  options:             PropTypes.object
};

MasonryComponent.defaultProps = defaultProps;
