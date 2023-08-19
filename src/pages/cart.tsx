import { useLocalStorageItem } from '@/hooks/useLocalStorage';
import { mockGetExchangeRate, mockGetProduct } from '@/libs';
import { LS_CART_ITEMS } from '@/libs/constants';
import { CartItemInStorage } from '@/types/misc';
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
import { useRouter } from 'next/router';

// import { GRClose } from 'react-icons/gr';

import { MdArrowBackIosNew, MdClose } from 'react-icons/md';

// 2. Use the `as` prop
function GRCloseIcon() {
  return <Icon as={MdClose} />;
}

type CardProps = {
  id: number;
  quantity: number;
  setQuantity: (newQuantity: number) => void;
};

function Card(props: CardProps) {
  const productInfo = mockGetProduct(props.id);
  const exchangeInfo = mockGetExchangeRate();

  return (
    <Box
      position={'relative'}
      width='100%'
      bg='white'
      boxShadow='sm'
      borderRadius='20px'
      p='20px'
    >
      <IconButton
        variant={'ghost'}
        aria-label='Close card'
        icon={<GRCloseIcon />}
        position='absolute'
        top='20px'
        right='20px'
        size='24px'
      />
      <Flex direction={'column'} gap='4px'>
        <HStack justify={'flex-start'} spacing='1'>
          <Image
            fit={'contain'}
            width='60px'
            height='60px'
            src={productInfo.thumbnail}
            alt={productInfo.name}
          />
          <VStack spacing={1}>
            <Text fontSize='18px' fontWeight='medium'>
              {productInfo.name}
            </Text>
            <HStack>
              <Button
                variant={'outline'}
                size={'xs'}
                rounded={'3xl'}
                onClick={() =>
                  props.setQuantity(Math.max(props.quantity - 1, 0))
                }
              >
                -
              </Button>
              <Text fontSize={'16px'}>{props.quantity}</Text>
              <Button
                variant={'outline'}
                size={'xs'}
                rounded={'3xl'}
                onClick={() => props.setQuantity(props.quantity + 1)}
              >
                +
              </Button>
            </HStack>
          </VStack>
        </HStack>
        <Flex>
          <Spacer />
          <Flex gap='4px'>
            <Text as={'b'}>
              {parseFloat(productInfo.price) * parseFloat(exchangeInfo.ARS)}
            </Text>
            <Text>ARS</Text>
            <Text as={'b'}>{parseFloat(productInfo.price)}</Text>
            <Text>USD</Text>
            <Text as={'b'}>
              {parseFloat(productInfo.price) * parseFloat(exchangeInfo.BTC)}
            </Text>
            <Text>BTC</Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function Cart() {
  const router = useRouter();
  const { item: cartItems, setItem: setCartItems } = useLocalStorageItem<
    CartItemInStorage[]
  >(LS_CART_ITEMS, []);
  if (!cartItems) return;

  const onCheckout = () => {
    // 결제 시도 시
  };

  return (
    <Flex direction='column' minH='100vh'>
      <Flex
        w='100%'
        align='center'
        justify='space-between'
        gap='10px'
        mt='15px'
        mb='13px'
      >
        <Box cursor='pointer' onClick={() => router.back()}>
          <MdArrowBackIosNew size='24px' />
        </Box>
        <Text fontSize='22px' fontWeight='700' flex={1} textAlign='center'>
          Shopping Cart
        </Text>
        <Box w='24px' h='24px' />
      </Flex>
      <Flex direction='column' gap='14px'>
        {cartItems.map((c) => (
          <Card
            key={c.id}
            id={c.id}
            quantity={c.quantity}
            setQuantity={(newQuantity: number) => {
              setCartItems((prev) =>
                (prev ?? []).reduce<CartItemInStorage[]>(
                  (acc, cur) =>
                    cur.id === c.id
                      ? [...acc, { ...cur, quantity: newQuantity }]
                      : [...acc, cur],
                  []
                )
              );
            }}
          />
        ))}
      </Flex>
      <Box flex={1} />
      <Flex gap='11px' pb='26px'>
        <Button colorScheme='red' onClick={onCheckout} w='100%'>
          Checkout
        </Button>
      </Flex>
    </Flex>
  );
}
