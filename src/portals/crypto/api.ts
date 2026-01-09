import { CryptoAsset, CryptoDetail, CryptoChartData, PricePoint } from './types';

// CoinGecko API - Free tier, no API key required
const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices(cryptoIds: string[]): Promise<CryptoAsset[]> {
  try {
    const ids = cryptoIds.join(',');
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }

    const data = await response.json();

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      currentPrice: coin.current_price,
      priceChange24h: coin.price_change_24h,
      priceChangePercentage24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      image: coin.image,
      high24h: coin.high_24h,
      low24h: coin.low_24h,
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
}

export async function getCryptoDetails(cryptoId: string): Promise<CryptoDetail | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${cryptoId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto details');
    }

    const data = await response.json();

    return {
      id: data.id,
      symbol: data.symbol.toUpperCase(),
      name: data.name,
      currentPrice: data.market_data.current_price.usd,
      priceChange24h: data.market_data.price_change_24h,
      priceChangePercentage24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      high24h: data.market_data.high_24h.usd,
      low24h: data.market_data.low_24h.usd,
      ath: data.market_data.ath.usd,
      athDate: data.market_data.ath_date,
      atl: data.market_data.atl.usd,
      atlDate: data.market_data.atl_date,
      circulatingSupply: data.market_data.circulating_supply,
      totalSupply: data.market_data.total_supply,
      image: data.image.large,
    };
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    return null;
  }
}

export async function getCryptoChart(cryptoId: string, days: number = 7): Promise<PricePoint[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto chart data');
    }

    const data: CryptoChartData = await response.json();

    // Transform to our format
    return data.prices.map((price: any) => ({
      timestamp: price[0],
      price: price[1],
    }));
  } catch (error) {
    console.error('Error fetching crypto chart:', error);
    return [];
  }
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(6)}`;
  }
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else {
    return `$${value.toLocaleString()}`;
  }
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
