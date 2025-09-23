export function calculatePosition(cursorPosition: { x: number, y: number }, menuHeight: number): {x: number, y: number} {
    const menuWidth = 288;
    const generalPadding = 8;
    const viewPortWidth = window.innerWidth;
    const viewPortHeight = window.innerHeight;

    // Padding berücksichtigen
    const maxX = viewPortWidth - menuWidth - generalPadding;
    const maxY = viewPortHeight - menuHeight - generalPadding;
    const minX = generalPadding;
    const minY = generalPadding;

    let x = cursorPosition.x;
    let y = cursorPosition.y;

    if (x + menuWidth > viewPortWidth - generalPadding) {
        x = cursorPosition.x - menuWidth;
    }
    if (y + menuHeight > viewPortHeight - generalPadding) {
        y = cursorPosition.y - menuHeight;
    }

    // Begrenzung auf den Bereich inkl. Padding
    if (x < minX) x = minX;
    else if (x > maxX) x = maxX;

    if (y < minY) y = minY;
    else if (y > maxY) y = maxY;

    return { x, y };
}