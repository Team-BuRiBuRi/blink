import { DropdownWithExchangeRate } from '@/components/DropdownWithExchangeRate';
import WhiteBox from '@/components/WhiteBox';
import useGetExchangeRate from '@/hooks/useGetExchangeRate';
import useGetProduct from '@/hooks/useGetProduct';
import useGetShop from '@/hooks/useGetShop';
import usePatchProduct from '@/hooks/usePatchProduct';
import { anyToFloat, formatMoney } from '@/libs/utils';
import { Box, Flex, Image, Input, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { MdArrowBackIosNew } from 'react-icons/md';

const ProductInfoPage = () => {
  const router = useRouter();
  const productId = useRouter().query.id;
  const { getProduct } = useGetProduct();
  const [productInfo, setProduct] = useState<Product | undefined>(undefined);
  const [fee, getFee] = useState(1);
  const getCardProduct = useCallback(
    () =>
      typeof productId === 'string'
        ? getProduct({ id: parseFloat(productId) })
        : undefined,
    [productId, getProduct]
  );
  const { patchProduct } = usePatchProduct();

  const { getShop } = useGetShop();
  const { getExchangeRate } = useGetExchangeRate();
  const [exchangeInfo, setExchangeInfo] =
    useState<GetAppliedExchangeRateResponse | null>(null);

  useEffect(() => {
    getCardProduct()?.then((p) => p && setProduct(p));
  }, [getCardProduct]);

  useEffect(() => {
    getExchangeRate().then((e) => e && setExchangeInfo(e));
  }, [getExchangeRate]);

  useEffect(() => {
    getShop({ id: 1 }).then((s) => s && getFee(parseFloat(s.fee)));
  }, [getShop]);

  if (!productId || typeof productId !== 'string') return <></>;
  if (!productInfo) return <></>;

  return (
    <Flex direction='column' gap='20px' pb='20px'>
      <Flex
        w='100%'
        align='center'
        justify='space-between'
        gap='10px'
        mt='15px'
      >
        <Image src='/logo.svg' alt='logo' onClick={() => router.push('/')} />
        <Box cursor='pointer'>
          <BsFillTrashFill size='24px' />
        </Box>
      </Flex>
      <Flex w='100%' align='center' gap='10px'>
        <Box
          cursor='pointer'
          onClick={() => {
            router.push('/');
          }}
        >
          <MdArrowBackIosNew size='24px' />
        </Box>
        <Text fontSize='22px' fontWeight='700' flex={1}>
          {productInfo.name}
        </Text>
        <Box cursor='pointer' w='24px' />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item Name
        </Text>
        <Input defaultValue={productInfo.name} bgColor={'white'} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item Image
        </Text>
        <Image
          src={`data:image/jpg;base64,${productInfo.thumbnail}`}
          alt={productInfo.name}
          w='100px'
          h='100px'
          borderRadius='20px'
          bg='white'
          objectFit='contain'
          boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Price of {productInfo.name}
        </Text>
        <WhiteBox
          rows={[
            {
              left: 'ARS',
              right: (
                <Text fontSize='16px' fontWeight='600' mr='14px'>
                  {formatMoney(
                    parseFloat(productInfo.price) *
                      parseFloat(exchangeInfo ? exchangeInfo.ars : '0') *
                      fee,
                    'ARS'
                  )}
                </Text>
              ),
            },
            {
              left: 'USD',
              right: (
                <Input
                  defaultValue={productInfo.price}
                  size='sm'
                  maxW='80px'
                  textAlign='right'
                  fontSize='16px'
                  fontWeight='600'
                  onChange={(e) => {
                    setProduct({
                      ...productInfo,
                      price: e.target.value,
                    });
                  }}
                  onBlur={(e) => {
                    patchProduct({
                      id: productInfo.id,
                      price: e.target.value,
                    });
                  }}
                />
              ),
            },
            {
              left: 'BTC',
              right: (
                <Text fontSize='16px' fontWeight='600' mr='14px'>
                  {formatMoney(
                    parseFloat(productInfo.price) *
                      parseFloat(exchangeInfo ? exchangeInfo.btc : '0') *
                      fee,
                    'BTC'
                  )}
                </Text>
              ),
            },
          ]}
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Sales and Profit
        </Text>
        <WhiteBox
          rows={[
            {
              left: 'Cost Price',
              right: (
                <DropdownWithExchangeRate
                  dollar={parseFloat(productInfo.buyprice)}
                  rate={
                    exchangeInfo || {
                      ars: '0',
                      btc: '0',
                    }
                  }
                />
              ),
            },
            {
              left: 'Sales',
              right: (
                <DropdownWithExchangeRate
                  dollar={parseFloat(productInfo.totalsales)}
                  rate={
                    exchangeInfo || {
                      ars: '0',
                      btc: '0',
                    }
                  }
                />
              ),
            },
            {
              left: 'Profit',
              right: (
                <DropdownWithExchangeRate
                  dollar={
                    parseFloat(productInfo.totalsales) -
                    parseFloat(productInfo.buyprice) *
                      anyToFloat(productInfo.buyquantity)
                  }
                  rate={
                    exchangeInfo || {
                      ars: '0',
                      btc: '0',
                    }
                  }
                />
              ),
            },
          ]}
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Manage Inventory
        </Text>
        <WhiteBox
          rows={[
            {
              left: 'Total Count',
              right: `${productInfo.buyquantity}`,
            },
            {
              left: 'Sales',
              right: `${productInfo.totalsalesquantity}`,
            },
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default ProductInfoPage;
