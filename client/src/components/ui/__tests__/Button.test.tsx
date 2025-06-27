// client/src/components/ui/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import { Button } from '../button'; // No necesitamos buttonVariants aquí si no podemos acceder a sus keys

describe('Button Component', () => {
  it('should render a button with children', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should apply default variant and size classes', () => {
    render(<Button>Default Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /default button/i });
    expect(buttonElement).toHaveClass('bg-primary text-primary-foreground');
    expect(buttonElement).toHaveClass('h-10 px-4 py-2');
  });

  it('should apply specified variant classes (destructive)', () => {
    render(<Button variant="destructive">Destructive</Button>);
    const buttonElement = screen.getByRole('button', { name: /destructive/i });
    expect(buttonElement).toHaveClass('bg-destructive text-destructive-foreground');
    expect(buttonElement).not.toHaveClass('bg-primary');
  });

  it('should apply specified variant classes (outline)', () => {
    render(<Button variant="outline">Outline</Button>);
    const buttonElement = screen.getByRole('button', { name: /outline/i });
    expect(buttonElement).toHaveClass('border border-input bg-background');
  });

  it('should apply specified variant classes (secondary)', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const buttonElement = screen.getByRole('button', { name: /secondary/i });
    expect(buttonElement).toHaveClass('bg-secondary text-secondary-foreground');
  });

  it('should apply specified variant classes (ghost)', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const buttonElement = screen.getByRole('button', { name: /ghost/i });
    expect(buttonElement).toHaveClass('hover:bg-accent hover:text-accent-foreground');
  });

  it('should apply specified variant classes (link)', () => {
    render(<Button variant="link">Link</Button>);
    const buttonElement = screen.getByRole('button', { name: /link/i });
    expect(buttonElement).toHaveClass('text-primary underline-offset-4 hover:underline');
  });


  it('should apply specified size classes (sm)', () => {
    render(<Button size="sm">Small</Button>);
    const buttonElement = screen.getByRole('button', { name: /small/i });
    expect(buttonElement).toHaveClass('h-9 rounded-md px-3');
    expect(buttonElement).not.toHaveClass('h-10');
  });

  it('should apply specified size classes (lg)', () => {
    render(<Button size="lg">Large</Button>);
    const buttonElement = screen.getByRole('button', { name: /large/i });
    expect(buttonElement).toHaveClass('h-11 rounded-md px-8');
  });

  it('should apply icon size classes', () => {
    render(<Button size="icon" aria-label="icon button"><i>I</i></Button>);
    const buttonElement = screen.getByRole('button', { name: /icon button/i });
    expect(buttonElement).toHaveClass('h-10 w-10');
  });


  it('should call onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /clickable/i });
    await userEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled/i });
    try {
      await userEvent.click(buttonElement);
    } catch (e) {
      // Silenciar error de userEvent al hacer clic en elemento deshabilitado
    }
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have the disabled attribute and apply disabled classes when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('disabled:opacity-50');
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveClass('bg-primary text-primary-foreground');
    expect(linkElement).toHaveClass('h-10 px-4 py-2');

    const buttonRoleElements = screen.queryAllByRole('button');
    const buttonWithText = buttonRoleElements.find(btn => btn.textContent === "Link Button");
    expect(buttonWithText).toBeUndefined();
  });

  it('should call onClick on child when asChild is true and child is clicked', async () => {
    const handleClick = vi.fn();
    render(
      <Button asChild onClick={handleClick}>
        <div data-testid="clickable-div">Clickable Div</div>
      </Button>
    );
    const divElement = screen.getByTestId('clickable-div');
    await userEvent.click(divElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should pass through other HTML attributes like type', () => {
    render(<Button type="submit">Submit Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /submit button/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  it('should correctly merge additional classNames', () => {
    render(<Button className="my-custom-class">Custom Class</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom class/i });
    expect(buttonElement).toHaveClass('my-custom-class');
    expect(buttonElement.className).toContain('bg-primary');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref Button');
  });

  it('should forward ref correctly with asChild to the child element', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/">Link Ref</a>
      </Button>
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.textContent).toBe('Link Ref');
  });
});
