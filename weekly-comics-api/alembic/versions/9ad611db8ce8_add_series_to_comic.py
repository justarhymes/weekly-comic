"""Add series to Comic

Revision ID: 9ad611db8ce8
Revises: 
Create Date: 2025-04-23 17:38:39.719022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '9ad611db8ce8'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comic', sa.Column('series', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.drop_column('comic', 'series_name')
    op.drop_column('comic', 'publisher')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comic', sa.Column('publisher', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('comic', sa.Column('series_name', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('comic', 'series')
    # ### end Alembic commands ###
