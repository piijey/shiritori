import { useState, useEffect } from 'react';

export const useShiritoriGrid = ( words ) => {
    const [grid, setGrid] = useState([]);

    useEffect(() => {
      updateGrid();
      // eslint-disable-next-line
    }, [words]);
  
    const updateGrid = () => {
      let newGrid = [];
      let offset = 0;
  
      words.forEach((wordObj, index) => {
        ['surface', 'reading'].forEach((key) => {
          const word = wordObj[key];
          if (!word) { return }
          let row = new Array(offset).fill({ character: null, class: null });
          for (let i = 0; i < word.length; i++) {
            const cellClass = `${wordObj.player}${key}`
            row.push({ character: word[i], class: cellClass})
          }
          newGrid.push(row);
          if (key === 'reading'){
            offset = offset + word.length - 1;
          }
        })
      });
      setGrid(newGrid);
    };
  
    const renderGrid = () => {
      return grid.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className={cell.class}>{cell.character || ''}</td>
          ))}
        </tr>
      ));
    };

    return { renderGrid };
};
