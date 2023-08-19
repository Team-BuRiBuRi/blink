import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';

// import { GRClose } from 'react-icons/gr';

import { MdClose } from 'react-icons/md';

// 2. Use the `as` prop
function GRCloseIcon() {
  return <Icon as={MdClose} />;
}

function Card() {
  return (
    <Box
      position={'relative'}
      width={315}
      height={105}
      bg='white'
      boxShadow='sm'
      borderRadius='xl'
      p={{ base: '4', md: '6' }}
    >
      <IconButton
        variant={'ghost'}
        aria-label='Close card'
        icon={<GRCloseIcon />}
        position='absolute'
        top={2}
        right={2}
      />
      <Flex direction={'column'}>
        <HStack justify={'flex-start'} spacing='1'>
          <Image
            fit={'contain'}
            width={55}
            height={55}
            src='tomato.png'
            alt=''
          />
          <VStack spacing={1}>
            <Text textStyle='lg' fontWeight='medium'>
              Tomato
            </Text>
            <HStack>
              <Button variant={'outline'} size={'xs'} rounded={'3xl'}>
                -
              </Button>
              <Text fontSize={'16px'}>1</Text>
              <Button variant={'outline'} size={'xs'} rounded={'3xl'}>
                +
              </Button>
            </HStack>
          </VStack>
        </HStack>
        <Flex>
          <Spacer />
          <Text mt={2} fontSize={'14px'}>
            <Text as={'b'}>261</Text> ARS <Text as={'b'}>0.75</Text> USD
            <Text as={'b'}>0.000029</Text> BTC
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function Cart() {
  return (
    <VStack>
      <Card />
      <Card />
      <Card />
    </VStack>
  );
}
