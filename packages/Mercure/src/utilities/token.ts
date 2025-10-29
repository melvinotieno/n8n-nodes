import jwt from "jsonwebtoken";

interface Props {
	topics: string[];
	jwtKey: jwt.Secret | jwt.PrivateKey;
	algorithm?: jwt.Algorithm;
	expiresIn?: jwt.SignOptions["expiresIn"];
}

export const generatePublisherToken = (props: Props): string => {
	return jwt.sign(
		{
			mercure: {
				publish: props.topics,
			},
		},
		props.jwtKey,
		{
			algorithm: props.algorithm || "HS256",
			expiresIn: props.expiresIn || "1h",
		},
	);
};

export const generateSubscriberToken = (props: Props): string => {
	return jwt.sign(
		{
			mercure: {
				subscribe: props.topics,
			},
		},
		props.jwtKey,
		{
			algorithm: props.algorithm || "HS256",
			expiresIn: props.expiresIn || "1h",
		},
	);
};
