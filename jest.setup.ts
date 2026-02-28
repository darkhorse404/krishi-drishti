// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '/',
            query: {},
            asPath: '/',
            push: jest.fn(),
            replace: jest.fn(),
            reload: jest.fn(),
            back: jest.fn(),
            prefetch: jest.fn(),
            beforePopState: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
                emit: jest.fn(),
            },
            isFallback: false,
            isLocaleDomain: false,
            isReady: true,
            isPreview: false,
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock Leaflet
jest.mock('leaflet', () => ({
    map: jest.fn(),
    tileLayer: jest.fn(),
    marker: jest.fn(),
    icon: jest.fn(),
    polyline: jest.fn(),
    LatLngBounds: jest.fn(),
    latLng: jest.fn(),
}))

jest.mock('react-leaflet', () => ({
    MapContainer: (props: any) => null,
    TileLayer: () => null,
    Marker: () => null,
    Popup: () => null,
    Polyline: () => null,
}))
