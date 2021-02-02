/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useState, createRef } from 'react';
import userEvent from '@testing-library/user-event';
import { render, fireEvent, screen } from 'garden-test-utils';
import { ColorDialog } from '.';
import { IRGBColor } from '../../utils/types';

describe('ColorDialog', () => {
  it('passes ref to underlying DOM element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<ColorDialog color="#17494D" ref={ref} data-test-id="colordialog" />);

    expect(screen.getByTestId('colordialog')).toBe(ref.current);
  });

  it('updates the color dialog button preview color', () => {
    const Basic = () => {
      const [color, setColor] = useState<IRGBColor | string>('rgba(23,73,77,1)');

      return <ColorDialog color={color} onClose={setColor} />;
    };

    render(<Basic />);

    const trigger = screen.getByRole('button');
    const preview = screen.getByTestId('dialog-preview');

    userEvent.click(trigger);

    expect(preview).toHaveStyleRule('background', 'rgba(23,73,77,1)');

    const hueSlider = screen.getByLabelText('Hue slider');
    const alphaSlider = screen.getByLabelText('Alpha slider');
    const hexInput = screen.getByLabelText('Hex');

    fireEvent.change(hueSlider, { target: { value: '349' } });
    fireEvent.change(alphaSlider, { target: { value: '.5' } });
    userEvent.type(hexInput, '{esc}');

    expect(screen.queryByLabelText('Hex')).toBeNull();
    expect(screen.queryByLabelText('Hue slider')).toBeNull();
    expect(screen.queryByLabelText('Alpha slider')).toBeNull();
    expect(preview).toHaveStyleRule('background', 'rgba(77,23,33,0.5)');
  });
});