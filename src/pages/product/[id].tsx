import WhiteBox from '@/components/WhiteBox';
import { mockGetExchangeRate, mockGetProduct } from '@/libs';
import { anyToFloat } from '@/libs/utils';
import { Box, Flex, Image, Input, Select, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { MdArrowBackIosNew } from 'react-icons/md';

const ProductInfoPage = () => {
  const productId = useRouter().query.id;
  if (!productId || typeof productId !== 'string')
    return <div>잘못된페이지</div>;

  const productInfo = mockGetProduct(parseFloat(productId));
  const exchangeInfo = mockGetExchangeRate();

  return (
    <Flex direction='column' gap='20px'>
      <Flex w='100%' align='center' gap='10px' mt='15px'>
        <Box cursor='pointer'>
          <MdArrowBackIosNew size='24px' />
        </Box>
        <Text fontSize='22px' fontWeight='700' flex={1}>
          {productInfo.name}
        </Text>
        <Box cursor='pointer'>
          <BsFillTrashFill size='24px' />
        </Box>
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item name
        </Text>
        <Input defaultValue={productInfo.name} />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Item Image
        </Text>
        <Image
          src={productInfo.thumbnail}
          alt={productInfo.name}
          w='100px'
          h='100px'
          borderRadius='20px'
          bg='white'
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
                  {parseFloat(productInfo.price) * parseFloat(exchangeInfo.ARS)}
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
                />
              ),
            },
            {
              left: 'BTC',
              right: (
                <Text fontSize='16px' fontWeight='600' mr='14px'>
                  {parseFloat(productInfo.price) * parseFloat(exchangeInfo.BTC)}
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
          rows={[{ left: 'Cost price', right: `${productInfo.totalSales}` }]}
        />
      </Flex>
      <Flex gap='14px' direction='column'>
        <Text fontSize='20px' fontWeight={500}>
          Manage Inventory
        </Text>
        <WhiteBox
          rows={[
            {
              left: 'Cost Price',
              right: (
                <DropdownWithExchangeRate
                  dollar={parseFloat(productInfo.buyPrice)}
                  rate={exchangeInfo}
                />
              ),
            },
            {
              left: 'Sales',
              right: (
                <DropdownWithExchangeRate
                  dollar={parseFloat(productInfo.totalSales)}
                  rate={exchangeInfo}
                />
              ),
            },
            {
              left: 'Profit',
              right: (
                <DropdownWithExchangeRate
                  dollar={
                    parseFloat(productInfo.totalSales) -
                    parseFloat(productInfo.buyPrice) *
                      anyToFloat(productInfo.buyQuantity)
                  }
                  rate={exchangeInfo}
                />
              ),
            },
          ]}
        />
      </Flex>
    </Flex>
  );
};

const DropdownWithExchangeRate = ({
  dollar,
  rate,
}: {
  dollar: number;
  rate: AppliedExchangeRate;
}) => {
  const [appliedRate, setAppliedRate] = useState<'USD' | 'ARS' | 'BTC'>('USD');
  const c =
    appliedRate === 'USD'
      ? 1
      : appliedRate === 'ARS'
      ? rate.ARS
      : appliedRate === 'BTC'
      ? rate.BTC
      : 1; // 너무 구린데 일단 이렇게 합니다

  return (
    <Flex align='center' gap='12px'>
      <Text fontSize='16px' fontWeight='600'>
        {dollar * anyToFloat(c)}
      </Text>
      <Select
        onChange={(c) =>
          setAppliedRate(c.target.value as 'USD' | 'ARS' | 'BTC')
        }
        value={appliedRate}
        size='md'
      >
        <option value='ARS'>ARS</option>
        <option value='USD'>USD</option>
        <option value='BTC'>BTC</option>
      </Select>
    </Flex>
  );
};

export default ProductInfoPage;
