export async function load({ locals }) {
    // Zkontrolujeme, jestli je uživatel v `locals`
    if (locals.user) {
        return {
            props: {
                user: locals.user // Vracíme uživatele jako prop
            }
        };
    } else {
        return {
            props: {
                user: null // Pokud není uživatel přihlášen, vracíme null
            }
        };
    }
}
