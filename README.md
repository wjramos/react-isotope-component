# React Masonry Component

## Table of contents

1. [Usage](#usage)

  1. [Basic usage](#basic-usage)
  2. [Custom props](#custom-props)
  3. [Accessing Masonry instance](#accessing-masonry-instance)
  4. [Events](#events)

### Introduction:

A React.js Masonry component.

### Usage:

- The component is bundled with Masonry, so no additional dependencies needed!

- To use the component just require the module.

#### Basic usage

`npm install --save react-masonry-component`

```javascript
import React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
    transitionDuration: 0
};

export default class Gallery extends React.Component {
    render ( ) {
        const childElements = this.props.elements.map(
          element => (
            <li className="image-element-class">
                <img src={element.src} />
            </li>
          )
        );

        return (
            <Masonry
                className={'my-gallery-class'} // default ''
                elementType={'ul'}             // default 'div'
                options={masonryOptions}       // default {}
                disableImagesLoaded={false}    // default false
                updateOnEachImageLoad={false}  // default false and works only if disableImagesLoaded is false
            >
                {childElements}
            </Masonry>
        )
    }
}
```

#### Custom props

You can also include your own custom props - EG: inline-style and event handlers.

```javascript
import React from 'react';
import Masonry from 'react-masonry-component';

const masonryOptions = {
    transitionDuration: 0
};

const style = {
    backgroundColor: 'tomato'
};


export default class Gallery extends React.Component {
    handleClick ( ) { /* ... */ }

    render ( ) {
        return (
            <Masonry
                className={'my-gallery-class'}
                style={style}
                onClick={e => this.handleClick()}
            >
                {...}
            </Masonry>
        )
    }
}
```

#### Accessing Masonry instance

Should you need to access the instance of Masonry (for example to listen to masonry events) you can do so by using `refs`.

```javascript
 import React from 'react';
 import Masonry from 'react-masonry-component';

 export default class Gallery extends React.Component {
     handleLayoutComplete ( ) { }

     componentDidMount ( ) {
         this.masonry.on( 'layoutComplete', this.handleLayoutComplete );
     }

     componentWillUnmount ( ) {
         this.masonry.off( 'layoutComplete', this.handleLayoutComplete );
     }

     render ( ) {
         return (
             <Masonry
                 ref={c => this.masonry = c.masonry}
             >
                 {...}
             </Masonry>
         )
     }
 }
```

#### Events

- `onImagesLoaded` - triggered when all images are loaded or after each image is loaded when `updateOnEachImageLoad` is set to `true`

```jsx
export default class Gallery extends React.Component {
    componentDidMount ( ) {
        this.hide();
    }

    handleImagesLoaded ( imagesLoadedInstance ) {
        this.show();
    }

    render ( ) {
        return (
            <Masonry
                onImagesLoaded={this.handleImagesLoaded}
            >
                {...}
            </Masonry>
        )
    }
}
```
