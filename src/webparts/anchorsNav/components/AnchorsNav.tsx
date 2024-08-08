import { ISPFXContext } from '@pnp/sp';
import * as React from 'react';
import AnchorsNavUI from '../../../components/AnchorsNavUI/AnchorsNavUI';

type AnchorsNavProps = {
  context: ISPFXContext;
}

const AnchorsNav = ({ context }: AnchorsNavProps) => {

  return (
    <AnchorsNavUI />
  )
}
export default AnchorsNav