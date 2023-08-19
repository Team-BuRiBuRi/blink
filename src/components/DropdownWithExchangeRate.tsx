import { anyToFloat } from '@/libs/utils';
import { Flex, Select, Text } from '@chakra-ui/react';
import { useState } from 'react';

export const DropdownWithExchangeRate = ({
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
      ? rate.ars
      : appliedRate === 'BTC'
      ? rate.btc
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
