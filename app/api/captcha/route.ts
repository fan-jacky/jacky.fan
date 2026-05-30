export async function POST(request: Request) {
    const { token } = await request.json();
    try {
        if (!token) throw new Error();

        const res = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        if (!res.ok) throw new Error(res.statusText);

        const data = await res.json();

        if (data.score > 0.5) {
            return new Response(null, {
                status: 200,
            });
        } else {
            return new Response(null, {
                status: 403,
            });
        }
    } catch (error) {
        return new Response(null, {
            status: 400,
            statusText: JSON.stringify(error),
        });
    }
}
