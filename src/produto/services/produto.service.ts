import { Produto } from './../entities/produto.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaService } from 'src/categoria/services/categoria.service';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    private categoriaService: CategoriaService
  ) {}

  async findAll(): Promise<Produto[]> {
    return await this.produtoRepository.find({
      relations:{
        categoria: true
      }
    });
  }

  async findById(id: number): Promise<Produto> {
    let produto = await this.produtoRepository.findOne({
      where: {
        id,
      },
      relations:{
        categoria: true
      }
    });

    if (!produto)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    const produto = await this.produtoRepository.find({
      where: {
        nome: ILike(`%${nome}%`),
      },
      relations: {
        categoria: true
      }
    });

    if (!produto)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    return produto;
  }

  async create(produto: Produto): Promise<Produto> {
   
    if (produto.categoria) {
     
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );

      if (!categoria)
        throw new HttpException(
          'Categoria não foi encontrada!',
          HttpStatus.NOT_FOUND,
        );
      return await this.produtoRepository.save(produto);
    }

    return await this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    const buscaProduto = await this.findById(produto.id);

    if (!buscaProduto || !produto.id)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    if (produto.categoria) {
      const categoria = await this.categoriaService.findById(
        produto.categoria.id,
      );

      if (!categoria)
        throw new HttpException(
          'Categoria não foi encontrada!',
          HttpStatus.NOT_FOUND,
        );
      return await this.produtoRepository.save(produto);
    }

    return await this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<DeleteResult> {
    const buscaProduto = await this.findById(id);

    if (!buscaProduto)
      throw new HttpException('Produto não encontrado!', HttpStatus.NOT_FOUND);

    return await this.produtoRepository.delete(id);
  }
}
