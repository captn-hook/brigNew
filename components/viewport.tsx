'use client';
import { Button, ButtonGroup } from "@nextui-org/button";

export const Viewport = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <canvas id="viewport" style={{ width: '100%', height: '100%' }}></canvas>
        </div>
    );
}
export const ViewportControl = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Viewport Controls</h1>
            <ButtonGroup>
                <Button radius="full" onPress={() => console.log('camera mode')}>Camera</Button>
                <Button radius="full" onPress={() => console.log('values mode')}>Values</Button>
                <Button radius="full" onPress={() => console.log('transparency mode')}>Transparency</Button>
            </ButtonGroup>
        </div>
    );
}