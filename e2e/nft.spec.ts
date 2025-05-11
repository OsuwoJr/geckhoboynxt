import { test, expect } from '@playwright/test';

test.describe('NFT Minting Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the NFT page
    await page.goto('/nft');
  });

  test('should show connect wallet button when not connected', async ({ page }) => {
    await expect(page.getByText('Connect Wallet')).toBeVisible();
    await expect(page.getByText('Please connect your wallet to mint NFTs')).toBeVisible();
  });

  test('should connect wallet and show minting interface', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum = {
        request: async () => ['0x123...'],
        on: () => {},
        removeListener: () => {},
      };
    });

    // Click connect wallet button
    await page.getByText('Connect Wallet').click();

    // Wait for wallet connection
    await expect(page.getByText('Mint Your NFT')).toBeVisible();
    await expect(page.getByPlaceholderText('ipfs://your-metadata-uri')).toBeVisible();
  });

  test('should show network switch button when on wrong network', async ({ page }) => {
    // Mock wallet connection on wrong network
    await page.evaluate(() => {
      window.ethereum = {
        request: async () => ['0x123...'],
        on: () => {},
        removeListener: () => {},
        chainId: '0x1', // Mainnet
      };
    });

    // Click connect wallet button
    await page.getByText('Connect Wallet').click();

    // Check for network switch button
    await expect(page.getByText('Switch to Anvil')).toBeVisible();
  });

  test('should handle minting process', async ({ page }) => {
    // Mock wallet connection and contract interactions
    await page.evaluate(() => {
      window.ethereum = {
        request: async () => ['0x123...'],
        on: () => {},
        removeListener: () => {},
        chainId: '0x7A69', // Anvil
      };
    });

    // Mock contract responses
    await page.route('**/api/contract/*', async (route) => {
      const url = route.request().url();
      if (url.includes('getNFTInfo')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            price: '1.0',
            maxSupply: '100',
            currentSupply: '50',
            royalty: '5',
          }),
        });
      } else if (url.includes('isWhitelisted')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(true),
        });
      } else if (url.includes('mint')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            transaction: {},
            tokenId: '1',
          }),
        });
      }
    });

    // Connect wallet
    await page.getByText('Connect Wallet').click();

    // Fill in token URI
    await page.getByPlaceholderText('ipfs://your-metadata-uri').fill('ipfs://test-uri');

    // Click mint button
    await page.getByText('Mint NFT').click();

    // Check for success message
    await expect(page.getByText('Successfully minted NFT with ID: 1')).toBeVisible();
  });

  test('should show error message when minting fails', async ({ page }) => {
    // Mock wallet connection and contract interactions
    await page.evaluate(() => {
      window.ethereum = {
        request: async () => ['0x123...'],
        on: () => {},
        removeListener: () => {},
        chainId: '0x7A69', // Anvil
      };
    });

    // Mock contract responses
    await page.route('**/api/contract/*', async (route) => {
      const url = route.request().url();
      if (url.includes('getNFTInfo')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({
            price: '1.0',
            maxSupply: '100',
            currentSupply: '50',
            royalty: '5',
          }),
        });
      } else if (url.includes('isWhitelisted')) {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(true),
        });
      } else if (url.includes('mint')) {
        await route.fulfill({
          status: 400,
          body: JSON.stringify({
            error: 'Minting failed',
          }),
        });
      }
    });

    // Connect wallet
    await page.getByText('Connect Wallet').click();

    // Fill in token URI
    await page.getByPlaceholderText('ipfs://your-metadata-uri').fill('ipfs://test-uri');

    // Click mint button
    await page.getByText('Mint NFT').click();

    // Check for error message
    await expect(page.getByText('Minting failed')).toBeVisible();
  });

  test('should handle wallet disconnection', async ({ page }) => {
    // Mock wallet connection
    await page.evaluate(() => {
      window.ethereum = {
        request: async () => ['0x123...'],
        on: () => {},
        removeListener: () => {},
        chainId: '0x7A69', // Anvil
      };
    });

    // Connect wallet
    await page.getByText('Connect Wallet').click();

    // Click disconnect button
    await page.getByText('Disconnect Wallet').click();

    // Check for connect wallet button
    await expect(page.getByText('Connect Wallet')).toBeVisible();
  });
}); 