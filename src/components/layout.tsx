import React, { ReactNode } from 'react';
import { Container } from '@chakra-ui/react';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Container bgColor={'gray.50'} px={30} maxW={375} minH={'100vh'}>
      {children}
    </Container>
  );
};

export default Layout;
