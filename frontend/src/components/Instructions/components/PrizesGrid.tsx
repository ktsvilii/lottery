import { FC } from 'react';
import { PrizesGridConfig } from '../types';

type Props = { config: PrizesGridConfig };

export const PrizesGrid: FC<Props> = ({ config }) => {
  return (
    <table className='table table-zebra'>
      <thead>
        <tr className='bg-base-200'>
          <th>{config.title_1}</th>
          <th>{config.title_2}</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(config.rows).map((row, index) => (
          <tr key={index}>
            <th>{index}</th>
            <td>{config.rows[row]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
