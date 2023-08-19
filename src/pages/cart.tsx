import { DropdownWithExchangeRate } from '@/components/DropdownWithExchangeRate';
import useGetExchangeRate from '@/hooks/useGetExchangeRate';
import useGetProduct from '@/hooks/useGetProduct';
import { useLocalStorageItem } from '@/hooks/useLocalStorage';
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
import { useCallback, useEffect, useState } from 'react';

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
  onDelete: () => void;
  exchangeInfo: GetAppliedExchangeRateResponse;
};

function Card(props: CardProps) {
  const { getProduct } = useGetProduct();
  const [productInfo, setProduct] = useState<Product | undefined>(undefined);
  const getCardProduct = useCallback(
    () => getProduct({ id: props.id }),
    [props.id, getProduct]
  );
  useEffect(() => {
    getCardProduct().then((p) => p && setProduct(p));
  }, [getCardProduct]);

  if (!productInfo) return <></>;

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
        onClick={props.onDelete}
      />
      <Flex direction={'column'} gap='4px'>
        <HStack justify={'flex-start'} spacing='1'>
          <Image
            fit={'contain'}
            width='60px'
            height='60px'
            src={`data:image/jpg;base64,${productInfo.thumbnail}`}
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
              {parseFloat(productInfo.price) *
                parseFloat(props.exchangeInfo.ars)}
            </Text>
            <Text>ARS</Text>
            <Text as={'b'}>{parseFloat(productInfo.price)}</Text>
            <Text>USD</Text>
            <Text as={'b'}>
              {parseFloat(productInfo.price) *
                parseFloat(props.exchangeInfo.btc)}
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
  const { getExchangeRate } = useGetExchangeRate();
  const [exchangeInfo, setExchangeInfo] =
    useState<GetAppliedExchangeRateResponse | null>(null);

  const [totalAmount, setTotalAmount] = useState(0);

  const { getProduct } = useGetProduct();

  useEffect(() => {
    Promise.all(
      (cartItems ?? []).map(async ({ id, quantity }) => ({
        quantity,
        product: await getProduct({ id }),
      }))
    ).then((allItemsPrice) => {
      setTotalAmount(
        allItemsPrice.reduce(
          (acc, cur) =>
            acc +
            parseFloat(cur.product ? cur.product.price : '0') * cur.quantity,
          0
        )
      );
    });
  }, [cartItems, getProduct]);

  useEffect(() => {
    getExchangeRate().then((e) => e && setExchangeInfo(e));
  }, [getExchangeRate]);

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
        {cartItems &&
          cartItems.map((c) => (
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
              onDelete={() => {
                setCartItems((prev) => prev?.filter((pc) => pc.id !== c.id));
              }}
              exchangeInfo={
                exchangeInfo || {
                  ars: '0',
                  btc: '0',
                }
              }
            />
          ))}
      </Flex>
      <Box flex={1} />
      <Flex gap='14px' pb='26px' direction='column'>
        <Flex justify='space-between' align='center'>
          <Text>Total</Text>
          <DropdownWithExchangeRate
            dollar={totalAmount}
            rate={
              exchangeInfo || {
                ars: '0',
                btc: '0',
              }
            }
          />
        </Flex>
        <Button colorScheme='red' onClick={onCheckout} w='100%'>
          Checkout
        </Button>
      </Flex>
    </Flex>
  );
}
