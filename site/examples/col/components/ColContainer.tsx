import {StyledColEditor} from "../style"

export const ColContainer = ({ children }) => {
	return (
		<StyledColEditor>
			<div
				style={{
					display: "flex",
					flexDirection: "row"
				}}
				className="col-container"
			>
				{children}
			</div>
		</StyledColEditor>

	)
}
