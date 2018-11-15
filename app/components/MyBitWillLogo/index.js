import React from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import Logo from './logo.svg';
import Img from '../Img';

const StyledLogo = styled(Link)`
  position: absolute;
  top: 21px;
  left: 21px;
`

const MyBitWillLogo = (
    <StyledLogo to="/">
      <Img
        src={Logo}
        alt="MyBit Will Dapp"
      />
    </StyledLogo>
);

export default MyBitWillLogo;
