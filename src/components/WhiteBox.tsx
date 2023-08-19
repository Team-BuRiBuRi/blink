import { Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';

type EachRow = {
  left: string | React.ReactNode;
  right: string | React.ReactNode;
};

type WhiteBoxProps = {
  rows: EachRow[];
};

const WhiteBox = (props: WhiteBoxProps) => {
  return (
    <Flex
      gap='12px'
      p='18px 14px'
      direction='column'
      justify='center'
      w='100%'
      bg='white'
      borderRadius='20px'
      boxShadow='3px 3px 40px 0px rgba(0, 0, 0, 0.05)'
    >
      {props.rows.map((r, idx) => {
        return (
          <>
            <Flex key={idx} justifyContent='space-between' align={'center'}>
              {typeof r.left === 'string' ? (
                <Text fontSize='16px' fontWeight='400'>
                  {r.left}
                </Text>
              ) : (
                r.left
              )}
              {typeof r.right === 'string' ? (
                <Text fontSize='16px' fontWeight='600'>
                  {r.right}
                </Text>
              ) : (
                r.right
              )}
            </Flex>
            {idx !== props.rows.length - 1 && <Divider />}
          </>
        );
      })}
    </Flex>
  );
};

export default WhiteBox;
