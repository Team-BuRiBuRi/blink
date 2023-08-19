import React from 'react';
import { Box, Flex, VStack, Heading, Link, Container } from '@chakra-ui/react';
import { ChakraProvider, CSSReset, theme } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Layout;
