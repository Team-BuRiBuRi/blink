import {
  Box,
  Button,
  Stack,
  VStack,
  HStack,
  Text,
  Image,
  Flex,
  Spacer,
} from '@chakra-ui/react';

function OldCard() {
  return (
    <Box bg='white' boxShadow='sm' borderRadius='lg' p={{ base: '4', md: '6' }}>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        spacing={{ base: '5', md: '6' }}
        justify='space-between'
      >
        <Stack spacing='1'>
          <Text textStyle='lg' fontWeight='medium'>
            Updates Available
          </Text>
          <Text textStyle='sm' color='fg.muted'>
            A new version is available.
          </Text>
        </Stack>
        <Box>
          <Button>Download</Button>
        </Box>
      </Stack>
    </Box>
  );
}

function Card() {
  return (
    <Box
      width={315}
      height={105}
      bg='white'
      boxShadow='sm'
      borderRadius='xl'
      p={{ base: '4', md: '6' }}
    >
      <Flex direction={'column'} >
        <HStack justify={'flex-start'} spacing='1'>
          <Image fit={'contain'} width={55} height={55} src='tomato.png' />
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
