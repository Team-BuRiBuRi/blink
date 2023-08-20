import useGetExchangeRate from '@/hooks/useGetExchangeRate';
import useGetProduct from '@/hooks/useGetProduct';
import { useLocalStorageItem } from '@/hooks/useLocalStorage';
import { LS_CART_ITEMS } from '@/libs/constants';
import { formatMoney } from '@/libs/utils';
import { CartItemInStorage } from '@/types/misc';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdOutlineShoppingCart } from 'react-icons/md';

const QRProductInfoPage = () => {
  const router = useRouter();
  const { setItem: setCardItems } = useLocalStorageItem<CartItemInStorage[]>(
    LS_CART_ITEMS,
    []
  );
  const [quantity, setQuantity] = useState(1);
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const { getProduct } = useGetProduct();

  const { getExchangeRate } = useGetExchangeRate();
  const [exchangeInfo, setExchangeInfo] =
    useState<GetAppliedExchangeRateResponse | null>(null);

  const productId = router.query.id;

  useEffect(() => {
    getExchangeRate().then((e) => e && setExchangeInfo(e));
  }, [getExchangeRate]);

  useEffect(() => {
    getProduct({ id: parseFloat(productId as string) }).then((p) => {
      if (p) setProductInfo(p);
    });
  }, [productId, getProduct]);

  if (!productId || typeof productId !== 'string') return <></>;

  const onMoveCartClick = () => {
    router.push('/cart');
  };

  const onSaveCartClick = () => {
    setCardItems((prev) =>
      prev
        ? [...prev, { id: parseFloat(productId), quantity }]
        : [{ id: parseFloat(productId), quantity }]
    );
    router.push('/cart');
  };

  return (
    <Flex direction='column' gap='20px' minHeight='100vh'>
      <Flex direction='column' gap='13px'>
        <Flex justifyContent='space-between' mt='15px'>
          <Image
            src='/logo.svg'
            alt='logo'
            onClick={() => router.push('/')}
            w='60px'
          />
          <Box cursor='pointer' onClick={onMoveCartClick}>
            <MdOutlineShoppingCart size='24px' />
          </Box>
        </Flex>
        <Flex w='100%' justify='center' gap='10px'>
          {productInfo ? (
            <Text fontSize='22px' fontWeight='700' flex={1} textAlign='center'>
              {productInfo?.name}
            </Text>
          ) : (
            <Skeleton w={247} h={33} borderRadius={20}></Skeleton>
          )}
        </Flex>
      </Flex>
      <Center>
        {productInfo ? (
          <Image
            src={`data:image/jpg;base64,${productInfo?.thumbnail}`}
            w='273px'
            h='273px'
            boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
            alt={productInfo?.name}
            borderRadius='20px'
            objectFit='contain'
          />
        ) : (
          <Skeleton w={273} h={273} borderRadius={20}></Skeleton>
        )}
      </Center>
      <Flex gap='16px' direction='column'>
        <Flex justify='space-between'>
          <Text color='#5f5f5f' fontSize='18px' fontWeight='600'>
            Quantity
          </Text>
          <HStack>
            <Button
              variant={'outline'}
              size={'xs'}
              rounded={'3xl'}
              onClick={() => setQuantity(Math.max(quantity - 1, 0))}
            >
              -
            </Button>
            <Text fontSize={'16px'}>{quantity}</Text>
            <Button
              variant={'outline'}
              size={'xs'}
              rounded={'3xl'}
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </HStack>
        </Flex>
        <Box h='1px' w='100%' bg='#c1c1c1' />
        <Flex direction='column' gap='16px'>
          <Text color='#5f5f5f' fontSize='18px' fontWeight='600'>
            ARS
          </Text>
          <Text fontSize='30px' fontWeight='700'>
            {formatMoney(
              parseFloat(productInfo ? productInfo.price : '0') *
                parseFloat(exchangeInfo ? exchangeInfo.ars : '0') *
                quantity,
              'ARS'
            )}
          </Text>
        </Flex>
        <Flex direction='column' gap='16px'>
          <Text color='#5f5f5f' fontSize='18px' fontWeight='600'>
            USD
          </Text>
          <Text fontSize='30px' fontWeight='700'>
            {formatMoney(
              parseFloat(productInfo ? productInfo.price : '0') * quantity,
              'USD'
            )}
          </Text>
        </Flex>
        <Flex direction='column' gap='16px'>
          <Text color='#5f5f5f' fontSize='18px' fontWeight='600'>
            BTC
          </Text>
          <Text fontSize='30px' fontWeight='700'>
            {formatMoney(
              parseFloat(productInfo ? productInfo.price : '0') *
                parseFloat(exchangeInfo ? exchangeInfo.btc : '0') *
                quantity,
              'BTC'
            )}
          </Text>
        </Flex>
      </Flex>
      <Box flex={1} />
      <SimpleGrid
        columns={2}
        gap='11px'
        pb='26px'
        display='flex'
        justifyContent='center'
      >
        {/* <Button
          colorScheme='gray'
          onClick={() => {
            // 창 닫기
          }}
        >
          Cancel
        </Button> */}
        <Button
          w={'100%'}
          bgColor={'#E2674E'}
          color={'white'}
          onClick={onSaveCartClick}
        >
          Add to Cart
        </Button>
      </SimpleGrid>
    </Flex>
  );
};

export default QRProductInfoPage;
