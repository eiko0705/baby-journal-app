CREATE TABLE child_profile (
    id INT PRIMARY KEY DEFAULT 1, -- プロフィールは1つだけなので、IDを1に固定
    nickname VARCHAR(255),
    gender VARCHAR(50),
    birthday DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_profile_check CHECK (id = 1)                                                     
);
