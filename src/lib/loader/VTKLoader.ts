import * as Zlib from 'three/examples/js/libs/zlib_and_gzip.min';

export class VTKLoader{
  constructor(THREE:any){
    THREE.VTKLoader = function( manager ) {
      this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    };
    Object.assign( THREE.VTKLoader.prototype, THREE.EventDispatcher.prototype, {

      load: function ( url, onLoad, onProgress, onError ) {

        let scope = this;

        let loader = new THREE.XHRLoader( scope.manager );
        loader.setResponseType( 'arraybuffer' );
        loader.load( url, function( text ) {

          onLoad( scope.parse( text ) );

        }, onProgress, onError );

      },

      parse: function ( data ) {

        function parseASCII( data ) {

          // connectivity of the triangles
          let indices = [];

          // triangles vertices
          let positions = [];

          // red, green, blue colors in the range 0 to 1
          let colors = [];

          // normal vector, one per vertex
          let normals = [];

          let result;

          // pattern for reading vertices, 3 floats or integers
          let pat3Floats = /(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g;

          // pattern for connectivity, an integer followed by any number of ints
          // the first integer is the number of polygon nodes
          let patConnectivity = /^(\d+)\s+([\s\d]*)/;

          // indicates start of vertex data section
          let patPOINTS = /^POINTS /;

          // indicates start of polygon connectivity section
          let patPOLYGONS = /^POLYGONS /;

          // indicates start of triangle strips section
          let patTRIANGLE_STRIPS = /^TRIANGLE_STRIPS /;

          // POINT_DATA number_of_values
          let patPOINT_DATA = /^POINT_DATA[ ]+(\d+)/;

          // CELL_DATA number_of_polys
          let patCELL_DATA = /^CELL_DATA[ ]+(\d+)/;

          // Start of color section
          let patCOLOR_SCALARS = /^COLOR_SCALARS[ ]+(\w+)[ ]+3/;

          // NORMALS Normals float
          let patNORMALS = /^NORMALS[ ]+(\w+)[ ]+(\w+)/;

          let inPointsSection = false;
          let inPolygonsSection = false;
          let inTriangleStripSection = false;
          let inPointDataSection = false;
          let inCellDataSection = false;
          let inColorSection = false;
          let inNormalsSection = false;

          let lines = data.split( '\n' );
          let i0;
          for ( let i in lines ) {

            let line = lines[ i ];

            if ( inPointsSection ) {

              // get the vertices
              while ( ( result = pat3Floats.exec( line ) ) !== null ) {

                let x = parseFloat( result[ 1 ] );
                let y = parseFloat( result[ 2 ] );
                let z = parseFloat( result[ 3 ] );
                positions.push( x, y, z );

              }

            } else if ( inPolygonsSection ) {

              if ( ( result = patConnectivity.exec( line ) ) !== null ) {

                // numVertices i0 i1 i2 ...
                let numVertices = parseInt( result[ 1 ] );
                let inds = result[ 2 ].split( /\s+/ );

                if ( numVertices >= 3 ) {

                  i0 = parseInt( inds[ 0 ] );
                  let i1, i2;
                  let k = 1;
                  // split the polygon in numVertices - 2 triangles
                  for ( let j = 0; j < numVertices - 2; ++ j ) {

                    i1 = parseInt( inds[ k ] );
                    i2 = parseInt( inds[ k + 1 ] );
                    indices.push( i0, i1, i2 );
                    k ++;

                  }

                }

              }

            } else if ( inTriangleStripSection ) {

              if ( ( result = patConnectivity.exec( line ) ) !== null ) {

                // numVertices i0 i1 i2 ...
                let numVertices = parseInt( result[ 1 ] );
                let inds = result[ 2 ].split( /\s+/ );

                if ( numVertices >= 3 ) {

                  let i1, i2;
                  // split the polygon in numVertices - 2 triangles
                  for ( let j = 0; j < numVertices - 2; j ++ ) {

                    if ( j % 2 === 1 ) {

                      i0 = parseInt( inds[ j ] );
                      i1 = parseInt( inds[ j + 2 ] );
                      i2 = parseInt( inds[ j + 1 ] );
                      indices.push( i0, i1, i2 );

                    } else {

                      i0 = parseInt( inds[ j ] );
                      i1 = parseInt( inds[ j + 1 ] );
                      i2 = parseInt( inds[ j + 2 ] );
                      indices.push( i0, i1, i2 );

                    }

                  }

                }

              }

            } else if ( inPointDataSection || inCellDataSection ) {

              if ( inColorSection ) {

                // Get the colors

                while ( ( result = pat3Floats.exec( line ) ) !== null ) {

                  let r = parseFloat( result[ 1 ] );
                  let g = parseFloat( result[ 2 ] );
                  let b = parseFloat( result[ 3 ] );
                  colors.push( r, g, b );

                }

              } else if ( inNormalsSection ) {

                // Get the normal vectors

                while ( ( result = pat3Floats.exec( line ) ) !== null ) {

                  let nx = parseFloat( result[ 1 ] );
                  let ny = parseFloat( result[ 2 ] );
                  let nz = parseFloat( result[ 3 ] );
                  normals.push( nx, ny, nz );

                }

              }

            }

            if ( patPOLYGONS.exec( line ) !== null ) {

              inPolygonsSection = true;
              inPointsSection = false;
              inTriangleStripSection = false;

            } else if ( patPOINTS.exec( line ) !== null ) {

              inPolygonsSection = false;
              inPointsSection = true;
              inTriangleStripSection = false;

            } else if ( patTRIANGLE_STRIPS.exec( line ) !== null ) {

              inPolygonsSection = false;
              inPointsSection = false;
              inTriangleStripSection = true;

            } else if ( patPOINT_DATA.exec( line ) !== null ) {

              inPointDataSection = true;
              inPointsSection = false;
              inPolygonsSection = false;
              inTriangleStripSection = false;

            } else if ( patCELL_DATA.exec( line ) !== null ) {

              inCellDataSection = true;
              inPointsSection = false;
              inPolygonsSection = false;
              inTriangleStripSection = false;

            } else if ( patCOLOR_SCALARS.exec( line ) !== null ) {

              inColorSection = true;
              inNormalsSection = false;
              inPointsSection = false;
              inPolygonsSection = false;
              inTriangleStripSection = false;

            } else if ( patNORMALS.exec( line ) !== null ) {

              inNormalsSection = true;
              inColorSection = false;
              inPointsSection = false;
              inPolygonsSection = false;
              inTriangleStripSection = false;

            }

          }

          let geometry;
          let stagger = 'point';

          if ( colors.length == indices.length ) {

            stagger = 'cell';

          }

          if ( stagger == 'point' ) {

            // Nodal. Use BufferGeometry
            geometry = new THREE.BufferGeometry();
            geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
            geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );

            if ( colors.length == positions.length ) {

              geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

            }

            if ( normals.length == positions.length ) {

              geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );

            }

          } else {

            // Cell centered colors. The only way to attach a solid color to each triangle
            // is to use Geometry, which is less efficient than BufferGeometry
            geometry = new THREE.Geometry();

            let numTriangles = indices.length / 3;
            let numPoints = positions.length / 3;
            let face;
            let ia, ib, ic;
            let x, y, z;
            let r, g, b;

            for ( let j = 0; j < numPoints; ++ j ) {

              x = positions[ 3 * j + 0 ];
              y = positions[ 3 * j + 1 ];
              z = positions[ 3 * j + 2 ];
              geometry.vertices.push( new THREE.Vector3( x, y, z ) );

            }

            for ( let i = 0; i < numTriangles; ++ i ) {

              ia = indices[ 3 * i + 0 ];
              ib = indices[ 3 * i + 1 ];
              ic = indices[ 3 * i + 2 ];
              geometry.faces.push( new THREE.Face3( ia, ib, ic ) );

            }

            if ( colors.length == numTriangles * 3 ) {

              for ( let i = 0; i < numTriangles; ++ i ) {

                face = geometry.faces[ i ];
                r = colors[ 3 * i + 0 ];
                g = colors[ 3 * i + 1 ];
                b = colors[ 3 * i + 2 ];
                face.color = new THREE.Color().setRGB( r, g, b );

              }

            }

          }

          return geometry;

        }

        function parseBinary( data ) {

          let count, pointIndex, i, numberOfPoints, s;
          let buffer = new Uint8Array ( data );
          let dataView = new DataView ( data );

          // Points and normals, by default, are empty
          let points;
          let normals;
          let indices;

          // Going to make a big array of strings
          let vtk = [];
          let index = 0;
          let i0;
          function findString( buffer, start ) {

            let index = start;
            let c = buffer[ index ];
            let s = [];
            while ( c != 10 ) {

              s.push ( String.fromCharCode ( c ) );
              index ++;
              c = buffer[ index ];

            }

            return { start: start,
              end: index,
              next: index + 1,
              parsedString: s.join( '' ) };

          }

          let state, line;

          while ( true ) {

            // Get a string
            state = findString ( buffer, index );
            line = state.parsedString;

            if ( line.indexOf ( 'POINTS' ) === 0 ) {

              vtk.push ( line );
              // Add the points
              numberOfPoints = parseInt ( line.split( ' ' )[ 1 ], 10 );

              // Each point is 3 4-byte floats
              count = numberOfPoints * 4 * 3;

              points = new Float32Array( numberOfPoints * 3 );

              pointIndex = state.next;
              for ( i = 0; i < numberOfPoints; i ++ ) {

                points[ 3 * i ] = dataView.getFloat32( pointIndex, false );
                points[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
                points[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
                pointIndex = pointIndex + 12;

              }
              // increment our next pointer
              state.next = state.next + count + 1;

            } else if ( line.indexOf ( 'TRIANGLE_STRIPS' ) === 0 ) {

              let numberOfStrips = parseInt ( line.split( ' ' )[ 1 ], 10 );
              let size = parseInt ( line.split ( ' ' )[ 2 ], 10 );
              // 4 byte integers
              count = size * 4;

              indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
              let indicesIndex = 0;

              pointIndex = state.next;
              for ( i = 0; i < numberOfStrips; i ++ ) {

                // For each strip, read the first value, then record that many more points
                let indexCount = dataView.getInt32( pointIndex, false );
                let strip = [];
                pointIndex += 4;
                for ( s = 0; s < indexCount; s ++ ) {

                  strip.push ( dataView.getInt32( pointIndex, false ) );
                  pointIndex += 4;

                }

                // retrieves the n-2 triangles from the triangle strip
                for ( let j = 0; j < indexCount - 2; j ++ ) {

                  if ( j % 2 ) {

                    indices[ indicesIndex ++ ] = strip[ j ];
                    indices[ indicesIndex ++ ] = strip[ j + 2 ];
                    indices[ indicesIndex ++ ] = strip[ j + 1 ];

                  } else {


                    indices[ indicesIndex ++ ] = strip[ j ];
                    indices[ indicesIndex ++ ] = strip[ j + 1 ];
                    indices[ indicesIndex ++ ] = strip[ j + 2 ];

                  }

                }

              }
              // increment our next pointer
              state.next = state.next + count + 1;

            } else if ( line.indexOf ( 'POLYGONS' ) === 0 ) {

              let numberOfStrips = parseInt ( line.split( ' ' )[ 1 ], 10 );
              let size = parseInt ( line.split ( ' ' )[ 2 ], 10 );
              // 4 byte integers
              count = size * 4;

              indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
              let indicesIndex = 0;

              pointIndex = state.next;
              for ( i = 0; i < numberOfStrips; i ++ ) {

                // For each strip, read the first value, then record that many more points
                let indexCount = dataView.getInt32( pointIndex, false );
                let strip = [];
                pointIndex += 4;
                for ( s = 0; s < indexCount; s ++ ) {

                  strip.push ( dataView.getInt32( pointIndex, false ) );
                  pointIndex += 4;

                }
                i0 = strip[ 0 ];
                // divide the polygon in n-2 triangle
                for ( let j = 1; j < indexCount - 1; j ++ ) {

                  indices[ indicesIndex ++ ] = strip[ 0 ];
                  indices[ indicesIndex ++ ] = strip[ j ];
                  indices[ indicesIndex ++ ] = strip[ j + 1 ];

                }

              }
              // increment our next pointer
              state.next = state.next + count + 1;

            } else if ( line.indexOf ( 'POINT_DATA' ) === 0 ) {

              numberOfPoints = parseInt ( line.split( ' ' )[ 1 ], 10 );

              // Grab the next line
              state = findString ( buffer, state.next );

              // Now grab the binary data
              count = numberOfPoints * 4 * 3;

              normals = new Float32Array( numberOfPoints * 3 );
              pointIndex = state.next;
              for ( i = 0; i < numberOfPoints; i ++ ) {

                normals[ 3 * i ] = dataView.getFloat32( pointIndex, false );
                normals[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
                normals[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
                pointIndex += 12;

              }

              // Increment past our data
              state.next = state.next + count;

            }

            // Increment index
            index = state.next;

            if ( index >= buffer.byteLength ) {

              break;

            }

          }

          let geometry = new THREE.BufferGeometry();
          geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
          geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );

          if ( normals.length == points.length ) {

            geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

          }

          return geometry;

        }

        function parseXML( stringFile ) {

          // Changes XML to JSON, based on https://davidwalsh.name/convert-xml-json
          let numberOfPoints;
          function xmlToJson( xml ) {

            // Create the return object
            let obj = {};

            if ( xml.nodeType == 1 ) { // element

              // do attributes

              if ( xml.attributes ) {

                if ( xml.attributes.length > 0 ) {

                  obj[ 'attributes' ] = {};

                  for ( let j = 0; j < xml.attributes.length; j ++ ) {

                    let attribute = xml.attributes.item( j );
                    obj[ 'attributes' ][ attribute.nodeName ] = attribute.nodeValue.trim();

                  }

                }

              }

            } else if ( xml.nodeType == 3 ) { // text

              obj = xml.nodeValue.trim();

            }

            // do children
            if ( xml.hasChildNodes() ) {

              for ( let i = 0; i < xml.childNodes.length; i ++ ) {

                let item = xml.childNodes.item( i );
                let nodeName = item.nodeName;

                if ( typeof( obj[ nodeName ] ) === 'undefined' ) {

                  let tmp = xmlToJson( item );

                  if ( tmp !== '' ) obj[ nodeName ] = tmp;

                } else {

                  if ( typeof( obj[ nodeName ].push ) === 'undefined' ) {

                    let old = obj[ nodeName ];
                    obj[ nodeName ] = [ old ];

                  }

                  let tmp = xmlToJson( item );

                  if ( tmp !== '' ) obj[ nodeName ].push( tmp );

                }

              }

            }

            return obj;

          }

          // Taken from Base64-js
          function Base64toByteArray( b64 ) {

            let Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
            let i;
            let lookup = [];
            let revLookup = [];
            let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            let len0 = code.length;

            for ( i = 0; i < len0; i ++ ) {

              lookup[ i ] = code[ i ];

            }

            for ( i = 0; i < len0; ++ i ) {

              revLookup[ code.charCodeAt( i ) ] = i;

            }

            revLookup[ '-'.charCodeAt( 0 ) ] = 62;
            revLookup[ '_'.charCodeAt( 0 ) ] = 63;

            let j, l, tmp, placeHolders, arr;
            let len = b64.length;

            if ( len % 4 > 0 ) {

              throw new Error( 'Invalid string. Length must be a multiple of 4' );

            }

            placeHolders = b64[ len - 2 ] === '=' ? 2 : b64[ len - 1 ] === '=' ? 1 : 0;
            arr = new Arr( len * 3 / 4 - placeHolders );
            l = placeHolders > 0 ? len - 4 : len;

            let L = 0;

            for ( i = 0, j = 0; i < l; i += 4, j += 3 ) {

              tmp = ( revLookup[ b64.charCodeAt( i ) ] << 18 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 12 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] << 6 ) | revLookup[ b64.charCodeAt( i + 3 ) ];
              arr[ L ++ ] = ( tmp & 0xFF0000 ) >> 16;
              arr[ L ++ ] = ( tmp & 0xFF00 ) >> 8;
              arr[ L ++ ] = tmp & 0xFF;

            }

            if ( placeHolders === 2 ) {

              tmp = ( revLookup[ b64.charCodeAt( i ) ] << 2 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] >> 4 );
              arr[ L ++ ] = tmp & 0xFF;

            } else if ( placeHolders === 1 ) {

              tmp = ( revLookup[ b64.charCodeAt( i ) ] << 10 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 4 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] >> 2 );
              arr[ L ++ ] = ( tmp >> 8 ) & 0xFF;
              arr[ L ++ ] = tmp & 0xFF;

            }

            return arr;

          }

          function parseDataArray( ele, compressed ) {

            // Check the format
            let content,txt,blob;
            if ( ele.attributes.format == 'binary' ) {

              if ( compressed ) {

                // Split the blob_header and compressed Data
                if ( ele[ '#text' ].indexOf( '==' ) != - 1 ) {

                  let data = ele[ '#text' ].split( '==' );

                  // console.log( data );

                  if ( data.length == 2 ) {

                    blob = data.shift();
                    content = data.shift();

                    if ( content === '' ) {

                      content = blob + '==';

                    }

                  } else if ( data.length > 2 ) {

                    blob = data.shift();
                    content = data.shift();
                    content = content + '==';

                  } else if ( data.length < 2 ) {

                    let content = data.shift();
                    content = content + '==';

                  }

                  // Convert to bytearray
                  let arr = Base64toByteArray( content );

                  // decompress
                  let inflate = new Zlib.Inflate( arr, { resize: true, verify: true } );
                  content = inflate.decompress();

                } else {

                  content = Base64toByteArray( ele[ '#text' ] );

                }

              } else {

                content = Base64toByteArray( ele[ '#text' ] );

              }

              content = content.buffer;

            } else {

              if ( ele[ '#text' ] ) {

                content = ele[ '#text' ].replace( /\n/g, ' ' ).split( ' ' ).filter( function ( el, idx, arr ) {

                  if ( el !== '' ) return el;

                } );

              } else {

                content = new Int32Array( 0 ).buffer;

              }

            }

            delete ele[ '#text' ];

            // Get the content and optimize it

            if ( ele.attributes.type == 'Float32' ) {

              txt = new Float32Array( content );

              if ( ele.attributes.format == 'binary' ) {

                if ( ! compressed ) {

                  txt = txt.filter( function( el, idx, arr ) {

                    if ( idx !== 0 ) return true;

                  } );

                }

              }

            } else if ( ele.attributes.type === 'Int64' ) {

              txt = new Int32Array( content );

              if ( ele.attributes.format == 'binary' ) {

                if ( ! compressed ) {

                  txt = txt.filter( function ( el, idx, arr ) {

                    if ( idx !== 0 ) return true;

                  } );

                }

                txt = txt.filter( function ( el, idx, arr ) {

                  if ( idx % 2 !== 1 ) return true;

                } );

              }

            }

            // console.log( txt );

            return txt;

          }

          // Main part
          // Get Dom
          let dom = null;

          if ( window['DOMParser'] ) {

            try {

              dom = ( new DOMParser() ).parseFromString( stringFile, 'text/xml' );

            } catch ( e ) {

              dom = null;

            }

          } else if ( window['ActiveXObject'] ) {

            try {
              let ActiveXObject = window['ActiveXObject'];
              dom = new ActiveXObject( 'Microsoft.XMLDOM' );
              dom.async = false;

              if ( ! dom.loadXML( window['xml'] ) ) {

                throw new Error( dom.parseError.reason + dom.parseError.srcText );

              }

            } catch ( e ) {

              dom = null;

            }

          } else {

            throw new Error( 'Cannot parse xml string!' );

          }

          // Get the doc
          let doc = dom.documentElement;
          // Convert to json
          let json = xmlToJson( doc );
          let points,normals,indices;

          if ( json['PolyData'] ) {

            let piece = json['PolyData'].Piece;
            let compressed = json['attributes'].hasOwnProperty( 'compressor' );

            // Can be optimized
            // Loop through the sections
            let sections = [ 'PointData', 'Points', 'Strips', 'Polys' ];// +['CellData', 'Verts', 'Lines'];
            let sectionIndex = 0, numberOfSections = sections.length;
            let arr;
            while ( sectionIndex < numberOfSections ) {

              let section = piece[ sections[ sectionIndex ] ];

              // If it has a DataArray in it

              if ( section.DataArray ) {

                // Depending on the number of DataArrays

                if ( Object.prototype.toString.call( section.DataArray ) === '[object Array]' ) {

                  arr = section.DataArray;

                } else {

                  arr = [ section.DataArray ];

                }

                let dataArrayIndex = 0, numberOfDataArrays = arr.length;

                while ( dataArrayIndex < numberOfDataArrays ) {

                  // Parse the DataArray
                  arr[ dataArrayIndex ].text = parseDataArray( arr[ dataArrayIndex ], compressed );
                  dataArrayIndex ++;

                }

                switch ( sections[ sectionIndex ] ) {

                  // if iti is point data
                  case 'PointData':

                    numberOfPoints = parseInt( piece.attributes.NumberOfPoints );
                    let normalsName = section.attributes.Normals;

                    if ( numberOfPoints > 0 ) {

                      for ( let i = 0, len = arr.length; i < len; i ++ ) {

                        if ( normalsName == arr[ i ].attributes.Name ) {

                          let components = arr[ i ].attributes.NumberOfComponents;
                          normals = new Float32Array( numberOfPoints * components );
                          normals.set( arr[ i ].text, 0 );

                        }

                      }

                    }

                    // console.log('Normals', normals);

                    break;

                  // if it is points
                  case 'Points':

                    numberOfPoints = parseInt( piece.attributes.NumberOfPoints );

                    if ( numberOfPoints > 0 ) {

                      let components = section.DataArray.attributes.NumberOfComponents;
                      points = new Float32Array( numberOfPoints * components );
                      points.set( section.DataArray.text, 0 );

                    }

                    // console.log('Points', points);

                    break;

                  // if it is strips
                  case 'Strips':

                    let numberOfStrips = parseInt( piece.attributes.NumberOfStrips );

                    if ( numberOfStrips > 0 ) {

                      let connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
                      let offset = new Int32Array( section.DataArray[ 1 ].text.length );
                      connectivity.set( section.DataArray[ 0 ].text, 0 );
                      offset.set( section.DataArray[ 1 ].text, 0 );

                      let size = numberOfStrips + connectivity.length;
                      indices = new Uint32Array( 3 * size - 9 * numberOfStrips );

                      let indicesIndex = 0;

                      for ( let i = 0,len = numberOfStrips; i < len; i ++ ) {

                        let strip = [];

                        for ( let s = 0, len1 = offset[ i ], len0 = 0; s < len1 - len0; s ++ ) {

                          strip.push ( connectivity[ s ] );

                          if ( i > 0 ) len0 = offset[ i - 1 ];

                        }

                        for ( let j = 0, len1 = offset[ i ], len0 = 0; j < len1 - len0 - 2; j ++ ) {

                          if ( j % 2 ) {

                            indices[ indicesIndex ++ ] = strip[ j ];
                            indices[ indicesIndex ++ ] = strip[ j + 2 ];
                            indices[ indicesIndex ++ ] = strip[ j + 1 ];

                          } else {

                            indices[ indicesIndex ++ ] = strip[ j ];
                            indices[ indicesIndex ++ ] = strip[ j + 1 ];
                            indices[ indicesIndex ++ ] = strip[ j + 2 ];

                          }

                          if ( i > 0 ) len0 = offset[ i - 1 ];

                        }

                      }

                    }

                    //console.log('Strips', indices);

                    break;

                  // if it is polys
                  case 'Polys':

                    let numberOfPolys = parseInt( piece.attributes.NumberOfPolys );

                    if ( numberOfPolys > 0 ) {

                      let connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
                      let offset = new Int32Array( section.DataArray[ 1 ].text.length );
                      connectivity.set( section.DataArray[ 0 ].text, 0 );
                      offset.set( section.DataArray[ 1 ].text, 0 );

                      let size = numberOfPolys + connectivity.length;
                      indices = new Uint32Array( 3 * size - 9 * numberOfPolys );
                      let indicesIndex = 0, connectivityIndex = 0;
                      let i = 0,len = numberOfPolys, len0 = 0;

                      while ( i < len ) {

                        let poly = [];
                        let s = 0, len1 = offset[ i ];

                        while ( s < len1 - len0 ) {

                          poly.push( connectivity[ connectivityIndex ++ ] );
                          s ++;

                        }

                        let j = 1;

                        while ( j < len1 - len0 - 1 ) {

                          indices[ indicesIndex ++ ] = poly[ 0 ];
                          indices[ indicesIndex ++ ] = poly[ j ];
                          indices[ indicesIndex ++ ] = poly[ j + 1 ];
                          j ++;

                        }

                        i ++;
                        len0 = offset[ i - 1 ];

                      }

                    }
                    //console.log('Polys', indices);
                    break;

                  default:
                    break;

                }

              }

              sectionIndex ++;

            }

            let geometry = new THREE.BufferGeometry();
            geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
            geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );

            if ( normals.length == points.length ) {

              geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

            }

            // console.log( json );

            return geometry;

          } else {

            // TODO for vtu,vti,and other xml formats

          }

        }

        function getStringFile( data ) {

          let stringFile = '';
          let charArray = new Uint8Array( data );
          let i = 0;
          let len = charArray.length;

          while ( len -- ) {

            stringFile += String.fromCharCode( charArray[ i ++ ] );

          }

          return stringFile;

        }

        // get the 5 first lines of the files to check if there is the key word binary
        let meta = String.fromCharCode.apply( null, new Uint8Array( data, 0, 250 ) ).split( '\n' );

        if ( meta[ 0 ].indexOf( 'xml' ) !== - 1 ) {

          return parseXML( getStringFile( data ) );

        } else if ( meta[ 2 ].includes( 'ASCII' ) ) {

          return parseASCII( getStringFile( data ) );

        } else {

          return parseBinary( data );

        }

      }

    } );
  }
}
