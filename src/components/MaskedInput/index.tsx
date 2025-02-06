import React from 'react';
import { MaskedInput as DefaultMaskedInput } from 'antd-mask-input';
import styles from './masked-input.module.css';
import { InputRef } from 'antd';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';

const MaskedInput = React.forwardRef<InputRef, MaskedInputProps>(
  (props, ref) => {
    return (
      <DefaultMaskedInput
        {...props}
        ref={ref}
        className={`css-var-r1 ant-input-css-var ${styles.input}`}
      />
    );
  }
);

export default MaskedInput;
