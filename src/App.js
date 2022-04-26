import { useState } from 'react';

export default function App() {
  const [nrCols, setNrCols] = useState(10);
  const [nrRows, setNrRows] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [tileTypes, setTileTypes] = useState([{
    name: "Wall",
    color: "#000000",
    active: true
  }])
  const [tiles, setTiles] = useState(new Array(20).fill(0).map(() => new Array(20).fill(0)));
  return (
    <div style={{display: "flex", height: "100%"}}>
      <div style={{
        width: 200,
        borderRight: "1px dashed black",
        display: "flex",
        flexDirection: "column",
        }}>
        <h1 style={{
          textAlign: "center",
          margin: 10
        }}>Tilemaker</h1>
        <NumberControl text="Columns" value={nrCols} onChange={setNrCols} />
        <NumberControl text="Rows" value={nrRows} onChange={setNrRows} />
        {tileTypes.map((tileType, index) => {
          return (
            <TileTypeControl
              key={index}
              index={index}
              tileType={tileType}
              tileTypes={tileTypes}
              onChange={(tileType) => {
                setTileTypes(tileTypes.map((t, i) => i === index ? tileType : {
                  name: t.name,
                  color: t.color,
                  active: tileType.active ? false: t.active
                }))
              }}
            />
          )})}
          <button
            style={{
              marginTop: 10,
              width: 100,
              alignSelf: "center"
            }}
            onClick={() => {
            setTileTypes([...tileTypes, {
              name: "",
              color: randomColor(),
              active: false
            }])
          }}>Add Tile type</button>
          <button
            style={{
              marginTop: 10,
              width: 150,
              alignSelf: "center"
            }}
            onClick={() => {
              let exportText = "{\n"+tiles.filter((row, index) => index < nrRows).map(x => "\t{"+x.filter((col, index) => index < nrCols).join(",")).join("},\n")+"}\n}"
              navigator.clipboard.writeText(exportText);
            }}
            >Export to clipboard</button>
      </div>
      <div>
        <TileGrid onMouseDown={() => {
          setIsActive(true);
        }}
        onMouseLeave={() => {
          setIsActive(false);
        }}
        onMouseUp={() => {
          setIsActive(false);
        }} isActive={isActive} tileTypes={tileTypes} nrCols={nrCols} nrRows={nrRows} tiles={tiles} onChange={(row, col, val) => {
          setTiles(tiles.map((rows, rowIndex) => {
            return rowIndex !== row ? rows : rows.map((cols, colIndex) => {
              return colIndex !== col ? cols : val
            })
          }));
        }} />
      </div>
    </div>
  );
}

function TileTypeControl({index, tileType, onChange, tileTypes}) {
  return (
    <div style={{
      padding: 10,
      display: "flex",
      justifyItems: "center",
      alignItems: "center"
    }}>
      <span style={{
        marginRight: 5,
        width: 20
      }}>{index}:</span>
      <input
        type="text"
        style={{
          minWidth: 0,
          marginRight: 5,
          fontSize: 16,
          width: 70
        }}
        value={tileType.name}
        onChange={(e) => {
          onChange({
            ...tileType,
            name: e.target.value
          })
        }}
      />
      <button
        style={{
          height: 30,
          marginRight: 5
        }}
        onClick={() => {
          onChange({
            ...tileType,
            active: !tileType.active
          })
        }}
        disabled={tileType.active}
      >Active</button>
      <input
        type="color"
        value={tileType.color}
        style={{
          marginRight: "5",
          padding: 0,
          border: 0,
          background: "none",
          width: 32
        }}
        onChange={(e) => {
          onChange({
            ...tileType,
            color: e.target.value
          })
        }}
      />
    </div>
  )
}


function TileGrid({nrCols, nrRows, tiles, onChange, tileTypes, isActive, onMouseDown, onMouseUp, onMouseLeave}) {
  return <div onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave} style={{display: 'flex', flexDirection:"column"}}>
    {tiles.map((rowVals, rowIndex) => {
      return rowIndex<nrRows ? <TileRow isActive={isActive} tiles={tiles} tileTypes={tileTypes} onChange={onChange} key={rowIndex} nrCols={nrCols} columns={rowVals} row={rowIndex} />: null;
    })}
  </div>
}

function TileRow({columns, row, nrCols, onChange, tileTypes, tiles, isActive}) {
  return <div style={{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }}>
    {columns.map((val, colIndex) => {
      return colIndex <nrCols ? <Tile isActive={isActive} val={val} tiles={tiles} tileTypes={tileTypes} onChange={onChange} key={colIndex} row={row} col={colIndex} /> : null;
  })}
  </div>
}

function Tile({row, col, onChange, tileTypes, tiles, val, isActive}) {
  return <div
    draggable={false}
    onMouseEnter={() => {
      if(isActive) {
        let activeColor = tileTypes.indexOf(tileTypes.find(x => x.active));
        if(activeColor !== val) {
          onChange(row, col, activeColor);
        }
      }
    }}
    onMouseDown={() => {
      let activeColor = tileTypes.indexOf(tileTypes.find(x => x.active));
      onChange(row, col, activeColor);
    }}
    style={{
      width: 40,
      height: 40,
      margin:0,
      border: "1px solid white",
      cursor: "pointer",
      background: tileTypes[val].color}} 
  />
}

function NumberControl({text, value, onChange}) {
  return <div style={{padding: 10, display:"flex", alignItems:"center"}}>
      <label style={{width: 75, display:"inline-block"}}>{text}: </label>
      <h3 style={{
        width: 40,
        height: 40,
        fontSize:24,
        margin:0,
        marginRight: 5,
        lineHeight:"40px",
        textAlign:"center"}}>{value}</h3>
      <div style={{
        display: 'inline-flex',
        flexDirection: 'column'
      }}>
        <button style={{height:30, width: 30}} onClick={() =>{
          if(value < 20) {
            onChange(value + 1)
          }
        }}>+</button>
        <button style={{height:30, width: 30}} onClick={() => {
          if(value > 3) {
            onChange(value - 1)
          }
        }}>-</button>
      </div>
    </div>
}

function randomColor() {
  return "#"+Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
}
